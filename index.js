let data, data2, model;
let selectedingredients = [];
let searchbar = document.getElementById("ingredients");
let box = document.getElementById("resultbox");
let resultlist = document.getElementById("resultlist");

async function fetchData_rec() {
    try {
        const response = await fetch("https://raw.githubusercontent.com/MaxAdamsen/Afsluttende-projekt/refs/heads/main/Bilag%20(JSON-filer)/varer.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        data = await response.json();
    } catch (error) {
        console.error("Error fetching or parsing data:", error);
    }
    return data;
}
fetchData_rec();
//--------------------------------------------------------------------------Bilag----------------------------------------------------------------------------------------//
async function fetchData_ing() {
    try {
        const response = await fetch("https://raw.githubusercontent.com/MaxAdamsen/Afsluttende-projekt/refs/heads/main/Bilag%20(JSON-filer)/ingredients.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        data2 = await response.json();
    } catch (error) {
        console.error("Error fetching or parsing data:", error);
    }
    return data2;
}
fetchData_ing();
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------//
function searchswitch(data) {
    let Words = selectedingredients.map(ing => ing.toLowerCase());
    let amount = selectedingredients.length;
    let filtered;

    if (amount < 3) {
        filtered = search1(data, Words);
    } else {
        filtered = search2(data, Words);
    }
    displayResults(filtered);
    return filtered;
}

function search1(data, words) {
    return data.filter(opskrift =>
        words.every(word => opskrift.ingredients.some(ingredient => ingredient.toLowerCase().includes(word)))
    );
}

function search2(data, words) {
    return data.filter(opskrift => {
        let count = 0;
        words.forEach(word => {
            if (opskrift.ingredients.some(ingredient => ingredient.toLowerCase().includes(word))) {
                count++;
            }
        });
        return count >= 3;
    });
}

function displayResults(results) {

    let resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];


    if (results.length === 0) {
        resultsDiv.innerHTML = "<p>No recipes found.</p>";
        return;
    }


    for (let i = 0; i < results.length; i++) {
        let recipe = results[i];

        let recipeDiv = document.createElement("div");

        let favoritecheck = favorites.some(favorite => favorite.name === recipe.name);
        let buttontext = favoritecheck ? "<i class='bi bi-star-fill'></i>" : "<i class='bi bi-star'></i>";

        recipeDiv.innerHTML = 
            '<div class="col h-100">' +
                '<div class="card h-100">' +
                '<img class="card-img-top" src="' + recipe.image + '" alt="' + recipe.name + '">' +
                    '<div class="card-body">' +
                    '<h5 class="card-title text-center">' + recipe.name + '</h5>' +
                        '<div class="mt-auto">' +
                            '<button id="button' + i + '" class="recipe-favorite-btn">' + buttontext + '</button>' +
                            '<button id="modalbutton' + i + '" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal">Show Recipe</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';

        resultsDiv.appendChild(recipeDiv);

        let button = document.getElementById("button" + i);
        button.addEventListener("click", () => {
            let fav = JSON.parse(localStorage.getItem("favorites")) || [];
            let favcheck = fav.some(favItem => favItem.name === recipe.name);

            if (favcheck) {
                fav = fav.filter(favItem => favItem.name !== recipe.name);
                button.innerHTML = "<i class='bi bi-star'></i>";
            } else {
                fav.push(recipe);
                button.innerHTML = "<i class='bi bi-star-fill'></i>";
            }

            localStorage.setItem("favorites", JSON.stringify(fav));
        });
        let modalbutton = document.getElementById("modalbutton" + i);
        modalbutton.addEventListener("click", () => modalinfo(recipe));
    }
}
//--------------------------------------------------------------------------Bilag----------------------------------------------------------------------------------------//
function displayfavorites() {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    displayResults(favorites);
}
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------//
function modalinfo(recipe) {
    let title = document.getElementById("modallabel");
    title.innerHTML = recipe.name;
    let modalBody = document.getElementById("modalbody");
    let instructions = recipe.instructions.split("\r\n").filter(instruction => instruction.trim() !== "");

    modalBody.innerHTML =
        '<img class="modalimg" src="' + recipe.image + '" alt="' + recipe.name + '">' +
        '<h3 style="font-size: x-large; font-weight: bold;">Ingredients</h3>' +
        '<ul class="mb-4">' +
        recipe.ingredients.map(ing => '<li>' + ing + '</li>').join('') +
        '</ul>' +
        '</div>' +
        '<h3>Instructions</h3>' +
        '<div class="mb-4">' +
        instructions.map(instruction => '<div class="mb-3">' + instruction + '</div>').join('') +
        '</div>';
}

searchbar.addEventListener("keyup", function () {
    let result = [];
    let input = searchbar.value; //Der bliver tilføjet en eventlistener, Når en bruger slipper knappen på deres tastatur, udløses funktionen.
    if (input.length !== 0) { //Et tomt array oprettes (result). Det vil blive brugt til at gemme de filtrerede resultater.
        result = data2.filter((word) => { //Variablen input henter værdien, som brugeren indtaster i søgefeltet (searchbar.value)
            return word.toLowerCase().includes(input.toLowerCase()); //Et if-statement kontrollere  om input “ikke” er tomt: Hvis inputtet ikke er tomt bliver filter() brugt på data2, hvor hvert element fra data2, og kalder det for word, så bliver det omdannet til små bogstaver (toLowerCase() ), og bliver så tjekket om det indeholder det indtastede input. Det nye “result” bliver herefter afspillet i displayresultsbox funktionen.
        })
    }
    displayresultbox(result);
})

function displayresultbox(result) {
    if (!result.length) {
        resultlist.innerHTML = "";
        box.style.display = "none";
    } else {
        let autocomplete = result.map((list) => {
            return "<li onclick=autocomplete(this) class='list-group-item'>" + list + "</li>";
        });
        resultlist.innerHTML = autocomplete.join("");
        box.style.display = "block";
    }
}
//--------------------------------------------------------------------------Bilag----------------------------------------------------------------------------------------//
function autocomplete(list) {
    selectedingredients.push(list.innerHTML);
    searchbar.value = '';
    resultlist.innerHTML = '';
    box.style.display = "none";
    console.log(selectedingredients);
    updateingredients(list);
}
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------//
function updateingredients() {
    let group = document.getElementById("ingredientgroup");
    group.innerHTML = "";

    selectedingredients.forEach(ingredient => {
        group.innerHTML += `
      <div onclick="remover('${ingredient}')" class="btn-group me-2">
        <button type="button" class="btn btn-primary ingredientbutton"><i class="bi bi-trash3"></i>${" "}${ingredient}</button>
      </div>
    `;
    });
}

function remover(ingredient) {
    let index = selectedingredients.indexOf(ingredient);
    selectedingredients.splice(index, 1);
    console.log(selectedingredients);
    updateingredients();
}

window.onload = async function () {
    let buttontxt = document.getElementById("modelbutton");
    model = await mobilenet.load();
    buttontxt.innerHTML = "Tilføj ingredienser fra billedet";
}

async function detectobjects() {
    let uploadedimage = document.getElementById("formFile");
    let imghtml = document.getElementById("imghtml");

    let file = uploadedimage.files[0];
    let url = URL.createObjectURL(file);
    imghtml.src = url;

    imghtml.onload = async function () {
        let threshold = 0.7;

        let predictions = await model.classify(imghtml);
        console.log(predictions);
        predictions = predictions.filter(predicition => predicition.probability >= threshold);
        console.log(predictions);
        let predictionsfiltered = predictions.filter((prediction) => {
            return data2.some(ingredient => ingredient.toLowerCase() === prediction.className.toLowerCase());
        }).map(prediction => prediction.className);
        console.log(predictionsfiltered);

        predictionsfiltered.forEach(ingredient => {
            if (!selectedingredients.includes(ingredient)) {
                selectedingredients.push(ingredient);
            }
        });
        updateingredients();
        URL.revokeObjectURL(url);
    };
}