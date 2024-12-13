    fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list")
        .then(response => response.json())
        .then(data => {
            console.log("Meal Categories:", data.meals);
        })
        .catch(error => {
            console.error("error:", error);
        });
        