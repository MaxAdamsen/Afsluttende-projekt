let data;
async function fetchData() {
    try {
        let response = await fetch("https://raw.githubusercontent.com/MaxAdamsen/Afsluttende-projekt/refs/heads/main/varer.json");

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        data = await response.json();

    } catch (error) {
        console.error("Error fetching or parsing data:", error);
    }
    return data
}
fetchData();

function words() {
    let søgning = document.getElementById("ingredients").value
    return søgning.split(",").map(word => word.trim().toLowerCase())
  }

function searchswitch(data){
    let Words = words();
    let amount = words().length;
    let filtered;

    if (amount < 3){
        filtered = search1(data, Words);
    }else{
        filtered = search2(data, Words);
}
    console.log(JSON.stringify(filtered, null, 2))
    return filtered;
}

function search1(data, words){
    return data.filter(opskrift => 
        words.every(word => opskrift.ingredients.includes(word))
    );
}

function search2(data, words){
        return data.filter(opskrift => {
            let count = 0;
            
            words.forEach(word => {
                if (opskrift.ingredients.includes(word)) {
                    count++;
                }
            });
            return count >= 3
        });
    }