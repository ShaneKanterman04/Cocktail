function addCocktail(cocktail) {
  //Create cocktail item
  let item = document.createElement("div")
  item.className = "cocktail-item"

  //add thumbnail
  const thumbnail = document.createElement("img")
  thumbnail.src = cocktail.strDrinkThumb
  thumbnail.width = 100
  item.appendChild(thumbnail)

  //Add name
  const name = document.createElement("h3")
  name.innerText = cocktail.strDrink
  item.appendChild(name)

  //Store cocktail data
  item.data = cocktail
  item.expanded = false

  document.getElementsByClassName("cocktail-list")[0].appendChild(item)
  item.addEventListener("mouseover", () => { expand(item) })
  item.addEventListener("mouseout", () => { collapse(item) })
}

function getRandomCoctails(x) {
  document.getElementsByClassName("cocktail-list")[0].innerHTML = ""
  for (let i = 0; i < 60; i++) {
    fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        addCocktail(data.drinks[0]);
      });
  }
}

function expand(item) {
  if (!item.expanded) {
    console.log(item.data)
    let list = document.createElement("ol")
    for (let i = 1; i <= 15; i++) {
      if (item.data["strIngredient" + i] != null) {
        let ingredient = document.createElement("li")
        ingredient.innerText = item.data["strIngredient" + i] + " " + item.data["strMeasure" + i]
        list.appendChild(ingredient)
      }
    }
    let instructions = document.createElement("li")
    instructions.innerText = item.data.strInstructions
    list.appendChild(instructions)
    item.appendChild(list)

    item.expanded = true
  }

}

function collapse(item) {
  if (item.expanded) {
    item.removeChild(item.lastChild)
    item.expanded = false
  }
}

document.getElementById("refreshBtn").addEventListener("click", () => { getRandomCoctails(60) })

getRandomCoctails(60)


