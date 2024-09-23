// Function to add a cocktail to the list
function addCocktail(cocktail) {
  // Create a container for the cocktail item
  let item = document.createElement("div");
  item.className = "cocktail-item";

  // Add cocktail thumbnail image
  const thumbnail = document.createElement("img");
  thumbnail.src = cocktail.strDrinkThumb;  // Set thumbnail source
  thumbnail.width = 100;  // Set thumbnail width
  item.appendChild(thumbnail);  // Append thumbnail to the item

  // Add cocktail name
  const name = document.createElement("h3");
  name.innerText = cocktail.strDrink;  // Set cocktail name
  item.appendChild(name);  // Append name to the item

  // Create a div to display ingredients and instructions when expanded
  let expandedDiv = document.createElement("div");
  expandedDiv.id = "expandedDiv";
  item.appendChild(expandedDiv);  // Append expandedDiv to the item

  // Add saved indicator
  let savedIndicator = document.createElement("img");
  savedIndicator.src = "imgs/unsaved.png";  // Set saved indicator source
  savedIndicator.width = 20;  // Set saved indicator width
  item.appendChild(savedIndicator);  // Append saved indicator to the item

  // Store cocktail data and initial states for expanded/clicked
  item.data = cocktail;  // Store cocktail data for later use
  item.expanded = false;  // To track if the item is expanded

  // Append the item to the cocktail list
  document.getElementsByClassName("cocktail-list")[0].appendChild(item);

  // Add event listeners for hover and click actions
  item.addEventListener("mouseover", () => { expand(item, expandedDiv); });
  item.addEventListener("mouseout", () => { collapse(item, expandedDiv); });
  item.addEventListener("click", () => { saveRecipe(item); });
}

// Fetches random cocktails from the API
function getRandomCoctails(x) {
  document.getElementById('page').innerText = "Find Cocktails!";  // Change the page title
  const headers = new Headers();
  headers.append("Access-Control-Allow-Origin", "*");

  // Fetch 60 random cocktails from the API
  for (let i = 0; i < x; i++) {
    fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php", {
      mode: 'cors',
      method: "GET",
    })
      .then((response) => response.json())  // Parse the JSON response
      .then((data) => {
        addCocktail(data.drinks[0]);  // Add each fetched cocktail to the list
      });
  }
}

// Expands the cocktail item to show ingredients and instructions
function expand(item, expandedDiv) {
  if (!item.expanded) {
    item.expanded = true;  // Set expanded to true

    // Create an ordered list for ingredients
    const list = document.createElement("ol");

    // Loop through 15 possible ingredients and add them to the list
    for (let i = 1; i <= 15; i++) {
      if (item.data["strIngredient" + i] != null) {
        let ingredient = document.createElement("li");
        ingredient.innerText = item.data["strIngredient" + i] + " " + item.data["strMeasure" + i];  // Ingredient with measurement
        list.appendChild(ingredient);  // Append ingredient to the list
      }
    }

    // Add the ingredients header
    let header = document.createElement('h4');
    header.innerHTML = "Ingredients";
    expandedDiv.appendChild(header);  // Append the header to the expandedDiv
    expandedDiv.appendChild(list);  // Append the list to the expandedDiv

    // Add cocktail instructions
    const instructions = document.createElement("p");
    instructions.innerText = item.data.strInstructions;  // Set instructions text

    // Add the instructions header
    header = document.createElement('h4');
    header.innerHTML = "Instructions";
    expandedDiv.appendChild(header);  // Append the header to the expandedDiv
    expandedDiv.appendChild(instructions);  // Append instructions to the expandedDiv
  }
}

// Collapses the expanded cocktail item
function collapse(item, expandedDiv) {
  if (item.expanded) {
    expandedDiv.innerHTML = "";  // Clear the expandedDiv
    item.expanded = false;  // Set expanded to false
  }
}

// Event listener to refresh the cocktail list when the refresh button is clicked
document.getElementById("refreshBtn").addEventListener("click", () => {
  getRandomCoctails(5);
});

// Initial call to load 60 random cocktails when the page loads
getRandomCoctails(10);

function displaySaved() {
  document.getElementById('page').innerText = "Saved Cocktails";  // Change the page title
  document.getElementById('refreshBtn').style.display = 'none';  // Hide the saved button
  document.getElementsByClassName('cocktail-list')[0].innerHTML = '';  // Clear current cocktail list
  let savedCocktails = JSON.parse(localStorage.getItem('savedCocktails')) || [];  // Get saved cocktails from local storage
  savedCocktails.forEach(e => {
    addCocktail(e);  // Add each saved cocktail to the list
  });
}

// Event listener to display saved cocktails when the saved button is clicked
document.getElementById('savedBtn').addEventListener('click', () => {
  displaySaved()
});

// Function to save a cocktail to localStorage
function saveRecipe(item) {
  let removed = false
  JSON.parse(localStorage.getItem('savedCocktails')).forEach(e => {
    if (e.strDrink === item.data.strDrink) {

      let savedCocktails = JSON.parse(localStorage.getItem('savedCocktails')) || [];
      savedCocktails = savedCocktails.filter(e => e.strDrink !== item.data.strDrink);
      localStorage.setItem('savedCocktails', JSON.stringify(savedCocktails));
      //displaySaved();
      removed = true;
      item.lastChild.src = 'imgs/unsaved.png';

    }
  })
  if (removed) {
    return;
  }
  let savedCocktails = JSON.parse(localStorage.getItem('savedCocktails')) || [];  // Get saved cocktails from local storage
  savedCocktails.push(item.data);  // Add the cocktail to the saved list
  localStorage.setItem('savedCocktails', JSON.stringify(savedCocktails));// Save updated list to local storage
  item.lastChild.src = 'imgs/saved.png';  // Change the saved indicator to saved
  
  item.lastChild.style.animation = null;  // Stop the animation
  item.lastChild.style.animation = 'likeA .2s';  // Stop the animation
  item.lastChild.style.animation = 'likeB .2s';  // Stop the animation
}



