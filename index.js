let data;
async function fetchData() {
    try {
        const response = await fetch("https://raw.githubusercontent.com/MaxAdamsen/Afsluttende-projekt/refs/heads/main/varer.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        data = await response.json();
    } catch (error) {
        console.error("Error fetching or parsing data:", error);
    }
    return data;
}

fetchData();

function words() {
    let søgning = document.getElementById("ingredients").value;
    return søgning.split(",").map(word => word.trim().toLowerCase());
}

function searchswitch(data) {
    let Words = words();
    let amount = words().length;
    let filtered;

    if (amount < 3) {
        filtered = search1(data, Words);
    } else {
        filtered = search2(data, Words);
    }
    displayResults(filtered)
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
        recipeDiv.className = "recipe";

        let favoritecheck = favorites.some(favorite => favorite.name === recipe.name);
        let buttontext = favoritecheck ? "Remove from favorites" : "Add to favorites";

        recipeDiv.innerHTML =
        '<div class="recipe-box">' + 
        '<div class="recipe-container">' + 
        '<img class="recipe-box img" src="' + recipe.image + '" alt="' + recipe.name + '">' +
        '<h2 class="recipe-box h2">' + recipe.name + '</h2>' +  
        '<button id="button'+ i +'" class="recipe-favorite-btn">'+buttontext+'</button>' +
        '<button id="modalbutton'+ i +'" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal">Show Recipe</button>' +
        '</div>'
        '</div>'

        resultsDiv.appendChild(recipeDiv);
        let button = document.getElementById("button" + i);

        if (favoritecheck) {
            button.addEventListener("click", () => removeFromFavorites(recipe));
        } else {
            button.addEventListener("click", () => addToFavorites(recipe));
        }
        
        let modalbutton = document.getElementById("modalbutton" + i);
        modalbutton.addEventListener("click", () => modalinfo(recipe));
    }
}

function addToFavorites(recipe) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.some(fav => fav.name === recipe.name)) {
        alert("This recipe is already in your favorites!");
        return;
    }

    favorites.push(recipe);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    console.log(favorites)
}

function removeFromFavorites(recipe) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites = favorites.filter(fav => fav.name !== recipe.name);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    console.log(favorites)
}

function displayfavorites() {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    displayResults(favorites);
}

function modalinfo(recipe){
    let title = document.getElementById("modallabel");
    title.innerHTML = recipe.name;
    let modalBody = document.getElementById("modalbody");
    let instructions = recipe.instructions.split("\r\n");
    let i = 1;

modalBody.innerHTML =
    '<img class="modalimg" src="' + recipe.image + '" alt="' + recipe.name + '">' +
    '<h3 style="font-size: x-large; font-weight: bold;">Ingredients</h3>' +
    '<ul class="mb-4">' +
        recipe.ingredients.map(ing => '<li>' + ing + '</li>').join('') +
    '</ul>' +
    '</div>' +
    '<h3>Instructions</h3>' +
    '<div class="d-flex flex-column">' +
        instructions.map(instruction => '<div class="mb-3">' + (i++) + '. ' + instruction + '</div>').join('') +
    '</div>';
}