async function fetchData() {
    try {
        let response = await fetch("https://raw.githubusercontent.com/MaxAdamsen/JSON1/refs/heads/main/varer.json");

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        let data = await response.json();

        console.log(data);
    } catch (error) {
        console.error("Error fetching or parsing data:", error);
    }
}
fetchData();