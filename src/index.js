function addCocktail(cocktail) {
    
    let item = document.createElement("li")
    item.innerHTML = cocktail.strDrink
    document.getElementById("cocktail-list").appendChild(item)
}

for (let i = 0; i < 10; i++) {
    fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php", {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          addCocktail(data.drinks[0]);
        });
}
