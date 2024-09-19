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

  // Create expanded div
  let expandedDiv = document.createElement("div")
  expandedDiv.id = "expandedDiv"
  item.appendChild(expandedDiv)

  //Store cocktail data
  item.data = cocktail
  item.expanded = false

  document.getElementsByClassName("cocktail-list")[0].appendChild(item)
  item.addEventListener("mouseover", () => { expand(item, expandedDiv) })
  item.addEventListener("mouseout", () => { collapse(item, expandedDiv) })
  item.addEventListener("click", () => { saveRecipe(item) })
}

function getRandomCoctails(x) {
  const headers = new Headers()
  headers.append("Access-Control-Allow-Origin", "*")
  for (let i = 0; i < 60; i++) {
    fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php", {
      mode: 'cors',
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        addCocktail(data.drinks[0]);
      });
  }
}

function expand(item, expandedDiv) {
  if (!item.expanded) {
    item.expanded = true
    
    // Init list
    const list = document.createElement("ol")

    // Add all ingredients to list
    for (let i = 1; i <= 15; i++) {
      if (item.data["strIngredient" + i] != null) {
        let ingredient = document.createElement("li")
        ingredient.innerText = item.data["strIngredient" + i] + " " + item.data["strMeasure" + i]
        list.appendChild(ingredient)
      }
    }
    
    let header = document.createElement('h4')
    header.innerHTML = "Ingrediants"

    expandedDiv.appendChild(header)

    expandedDiv.appendChild(list)

    const instructions = document.createElement("p")
    instructions.innerText = item.data.strInstructions

    header = document.createElement('h4')
    header.innerHTML = "Instructions"
    expandedDiv.appendChild(header)
    expandedDiv.appendChild(instructions)
  }

}

function collapse(item, expandedDiv) {
  if (item.expanded) {
    expandedDiv.innerHTML = ""
    item.expanded = false
  }
}

document.getElementById("refreshBtn").addEventListener("click", () => { getRandomCoctails(60) })

getRandomCoctails(60)


document.getElementById('savedBtn').addEventListener('click', () => {
  document.getElementsByClassName('cocktail-list')[0].innerHTML = ''
  let savedCocktails = JSON.parse(localStorage.getItem('savedCocktails')) || []
  savedCocktails.forEach(e => {
    addCocktail(e)
  });
})

function saveRecipe(item) {
  let savedCocktails = JSON.parse(localStorage.getItem('savedCocktails')) || []
  savedCocktails.push(item.data)
  localStorage.setItem('savedCocktails', JSON.stringify(savedCocktails))
  console.log('saved');
}