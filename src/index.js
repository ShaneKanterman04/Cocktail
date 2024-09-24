var state = 'new'

// Function to add a cocktail to the list
function addCocktail(cocktail, saved) {
  // Create a container for the cocktail item
  let item = document.createElement("div");
  item.className = "cocktail-item";

  // Add cocktail thumbnail image
  const thumbnail = document.createElement("img");
  thumbnail.src = cocktail.strDrinkThumb; // Set thumbnail source
  thumbnail.width = 100; // Set thumbnail width
  item.appendChild(thumbnail); // Append thumbnail to the item

  // Add cocktail name
  const name = document.createElement("h3");
  name.innerText = cocktail.strDrink; // Set cocktail name
  item.appendChild(name); // Append name to the item

  // Create a div to display ingredients and instructions when expanded
  let expandedDiv = document.createElement("div");
  expandedDiv.id = "expandedDiv";
  item.appendChild(expandedDiv); // Append expandedDiv to the item

  // Add saved indicator
  let savedIndicator = document.createElement("img");
  const imgPath = saved ? 'imgs/saved.png' : 'imgs/unsaved.png';
  savedIndicator.src = imgPath; // Set saved indicator source
  savedIndicator.width = 20; // Set saved indicator width
  item.appendChild(savedIndicator); // Append saved indicator to the item

  // Store cocktail data and initial states for expanded/clicked
  item.data = cocktail; // Store cocktail data for later use
  item.expanded = false; // To track if the item is expanded

  // Append the item to the cocktail list
  document.getElementsByClassName("cocktail-list")[0].appendChild(item);

  // Add event listeners for hover and click actions
  item.addEventListener("mouseover", () => expand(item, expandedDiv));
  item.addEventListener("mouseout", () => collapse(item, expandedDiv));
  item.addEventListener("click", () => saveRecipe(item));
}

// Fetches random cocktails from the API
function getRandomCoctails(x) {
  state = 'new'
  document.getElementById('clearBtn').style.display = 'none'; 
  document.getElementById('page').innerText = "Find Cocktails!"; // Change the page title
  const headers = new Headers();
  headers.append("Access-Control-Allow-Origin", "*");

  // Fetch x random cocktails from the API
  for (let i = 0; i < x; i++) {
    fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php", {
      mode: 'cors',
      method: "GET",
    })
    .then(response => response.json()) // Parse the JSON response
    .then(data => addCocktail(data.drinks[0])); // Add each fetched cocktail to the list
  }
}

// Expands the cocktail item to show ingredients and instructions
function expand(item, expandedDiv) {
  if (!item.expanded) {
    item.expanded = true; // Mark as expanded

    // Create an ordered list for ingredients
    const list = document.createElement("ol");

    // Loop through 15 possible ingredients and add them to the list
    for (let i = 1; i <= 15; i++) {
      if (item.data["strIngredient" + i]) {
        let ingredient = document.createElement("li");
        ingredient.innerText = `${item.data["strIngredient" + i]} - ${item.data["strMeasure" + i]}`;
        list.appendChild(ingredient); // Append ingredient to the list
      }
    }

    // Add ingredients and instructions to expandedDiv
    expandedDiv.innerHTML = `<h4>Ingredients</h4>`;
    expandedDiv.appendChild(list);
    expandedDiv.innerHTML += `<h4>Instructions</h4><p>${item.data.strInstructions}</p>`;
  }
}

// Collapses the expanded cocktail item
function collapse(item, expandedDiv) {
  if (item.expanded) {
    expandedDiv.innerHTML = ""; // Clear the expandedDiv
    item.expanded = false; // Mark as not expanded
  }
}

// Event listener to refresh the cocktail list
document.getElementById("refreshBtn").addEventListener("click", () => getRandomCoctails(5));

// Initial call to load random cocktails on page load
getRandomCoctails(10);

// Displays saved cocktails
function displaySaved() {
  state = 'saved'
  document.getElementById('page').innerText = "Saved Cocktails";
  document.getElementById('refreshBtn').style.display = 'none';
  document.getElementsByClassName('cocktail-list')[0].innerHTML = '';
  document.getElementById('clearBtn').style.display = 'block';
  let savedCocktails = JSON.parse(localStorage.getItem('savedCocktails')) || [];
  savedCocktails.forEach(cocktail => addCocktail(cocktail,true));
}

// Event listener to display saved cocktails
document.getElementById('savedBtn').addEventListener('click', displaySaved);

// Saves a cocktail recipe to localStorage
function saveRecipe(item) {
  let savedCocktails = JSON.parse(localStorage.getItem('savedCocktails')) || [];
  let index = savedCocktails.findIndex(c => c.strDrink === item.data.strDrink);

  if (index === -1) {
    savedCocktails.push(item.data); // Add new cocktail
    item.lastChild.src = 'imgs/saved.png'; // Update saved indicator
    localStorage.setItem('savedCocktails', JSON.stringify(savedCocktails)); // Save updated list
  } else {
    savedCocktails.splice(index, 1); // Remove cocktail
    item.lastChild.src = 'imgs/unsaved.png'; // Update saved indicator
    localStorage.setItem('savedCocktails', JSON.stringify(savedCocktails)); // Save updated list
    if(state === 'saved'){
      displaySaved() // Refresh display
    }
    
  }
  
}

// Clears all saved cocktails
function clearSaved() {
  if (confirm('Clear all saved cocktails?')) {
    localStorage.setItem('savedCocktails', JSON.stringify([])); // Clear saved cocktails
    displaySaved(); // Refresh display
  }
}

// Event listener to clear saved cocktails
document.getElementById('clearBtn').addEventListener('click', clearSaved);