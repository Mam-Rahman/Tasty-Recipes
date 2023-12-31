// YouTube API key
const youtubeApiKey = "AIzaSyB5dX3pFkRAZUPgX1JfHuPeSJdUvmd7KhU";
// here i have set up variables for api's
const apiKey = '1';
const baseUrl = 'https://www.themealdb.com/api/json/v1/1/search.php';

const searchInput = document.getElementById('searchInput');
const suggestionsContainer = document.getElementById('suggestions');
const searchButton = document.getElementById('searchButton');
const resultsContainer = document.getElementById('results');
const categoryContainer = document.getElementById('categoryContainer');
const recipeDetailsContainer = document.getElementById('recipeDetails');
const recentlySearchedContainer = document.getElementById('recentlySearchedContainer');

const maxRecentlySearchedRecipes = 3;

// added an event listener to the search input to provide search suggestions as the user types the 3 characters
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();

    //  at least 3 characters, fetch suggestions
    if (searchTerm.length >= 3) {
        fetchSuggestions(searchTerm);
    } else {
        // if less than 3 characters, clear and hide the suggestions 
        suggestionsContainer.classList.remove('show');
        suggestionsContainer.innerHTML = '';
    }
});

//  added an event listener to the search button to bring recipes search when clicked
searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.toLowerCase();
    fetchRecipes(searchTerm);
});

//  fetch and display recipes
function fetchCategories() {
    // category data from the API
    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
        .then(response => response.json())
        .then(data => {
            //  displaying the categories on the page
            displayCategories(data.categories);
        })
        .catch(error => {
            // handling error
            console.error('Error fetching categories:', error);
        });
}

// displaying the meal categories received from the API
function displayCategories(categories) {
    // creating a heading for the category sectio
    const categoryHeading = document.createElement('h2');
    categoryHeading.textContent = 'You can click on a category below for recipe ideas:';
    categoryContainer.appendChild(categoryHeading);

    // creating a grid for displaying category cards
    const categoryGrid = document.createElement('div');
    categoryGrid.classList.add('row');

    // iterating through each category and creating cards for them
    categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.classList.add('col-md-3', 'mb-4', 'category-card');

        // setting up an image for the category card
        const categoryImage = document.createElement('img');
        categoryImage.src = category.strCategoryThumb;
        categoryImage.alt = category.strCategory;
        categoryImage.classList.add('card-img-top');

        // creating a card body for the category card
        const categoryCardBody = document.createElement('div');
        categoryCardBody.classList.add('card-body');

        // adding a title for the category card
        const categoryTitle = document.createElement('h5');
        categoryTitle.classList.add('card-title');
        categoryTitle.textContent = category.strCategory;

        // appending elements to the category card and handling click events
        categoryCardBody.appendChild(categoryTitle);
        categoryCard.appendChild(categoryImage);
        categoryCard.appendChild(categoryCardBody);

        // adding a click event listener to each category card to fetch recipes for that category
        categoryCard.addEventListener('click', () => {
            // clearing the category container and highlighting the selected category card
            categoryContainer.innerHTML = '';
            const categoryCards = document.querySelectorAll('.category-card');
            categoryCards.forEach(card => card.classList.remove('active'));
            categoryCard.classList.add('active');

            // fetching recipes for the selected category
            fetchRecipesByCategory(category.strCategory);
        });

        // adding the category card to the category grid
        categoryGrid.appendChild(categoryCard);
    });

    // appending the category grid to the category container
    categoryContainer.appendChild(categoryGrid);
}

// Move the fetchRecentlySearchedRecipes function call outside of window.onload
fetchCategories();

// Call fetchRecentlySearchedRecipes independently when the page loads
fetchRecentlySearchedRecipes();

// fetch search suggestions based on user input
function fetchSuggestions(searchTerm) {
    const url = `${baseUrl}?s=${searchTerm}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // displaying recipe search suggestions
            recipeSuggestions(data.meals);
        })
        .catch(error => {
            // handling errors if fetching suggestions fails
            console.error('Error fetching suggestions:', error);
        });
}

// displaying recipe search suggestions
function recipeSuggestions(suggestions) {
    // clearing the contrainers go videos recupes and suggestions
    videoDetailsContainer.innerHTML = ''; 
    recipeDetailsContainer.innerHTML = '';
    suggestionsContainer.innerHTML = '';

    // check if there are no suggestions or none returned
    if (!suggestions) {
        // if we have no suggestions we can hide the suggestions container
        suggestionsContainer.classList.remove('show');
        return;
    }

    // returning the amount of suggestions, chose 5
    const amountOfSuggestions = 5;

    // loop through a maximum of 'amountOfSuggestions' or the available suggestions
    for (let i = 0; i < Math.min(suggestions.length, amountOfSuggestions); i++) {
        const suggestion = suggestions[i];

        // a button element for each recipe
        const suggestionItem = document.createElement('button');
        suggestionItem.classList.add('dropdown-item');
        suggestionItem.textContent = suggestion.strMeal;

        // a click event listener to the suggestion button
        suggestionItem.addEventListener('click', () => {
            // set the selected suggestion as the search input
            searchInput.value = suggestion.strMeal;

            // hide the suggestions container
            suggestionsContainer.classList.remove('show');

            // recipes for the selected suggestion
            fetchRecipes(suggestion.strMeal);
        });

        // the suggestion button to the suggestions container
        suggestionsContainer.appendChild(suggestionItem);
    }

    // show the suggestions container
    suggestionsContainer.classList.add('show');
}

// defining a function to fetch recipes based on a search term
function fetchRecipes(searchTerm) {
    recipeDetailsContainer.innerHTML = '';
    const url = `${baseUrl}?s=${searchTerm}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // displaying the fetched recipes
            displayRecipes(data.meals);
        });
}

// defining a function to fetch recipes based on a selected category
function fetchRecipesByCategory(category) {
    categoryContainer.innerHTML = '';
    recipeDetailsContainer.innerHTML = '';
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // displaying the recipes for the selected category
            displayRecipes(data.meals);
        });
}

// defining a function to display recipes in the results container
function displayRecipes(recipes) {
    categoryContainer.innerHTML = '';
    resultsContainer.innerHTML = '';

    if (!recipes) {
        resultsContainer.textContent = 'No recipes found.';
        return;
    }

    // creating a row for displaying recipe cards
    const row = document.createElement('div');
    row.classList.add('row');

    // iterating through each recipe and creating a card for it
    recipes.forEach(recipe => {
        const recipeCol = document.createElement('div');
        recipeCol.classList.add('col-md-4', 'mb-3');

        const recipeCard = document.createElement('div');
        recipeCard.classList.add('card');

        // setting up an image for the recipe card
        const recipeImage = document.createElement('img');
        recipeImage.src = recipe.strMealThumb;
        recipeImage.alt = recipe.strMeal;
        recipeImage.classList.add('card-img-top');

        // creating a card body for the recipe card
        const recipeCardBody = document.createElement('div');
        recipeCardBody.classList.add('card-body');

        // adding a link for the recipe title
        const recipeLink = document.createElement('a');
        recipeLink.href = '#';
        recipeLink.textContent = recipe.strMeal;
        recipeLink.classList.add('card-title');

        // adding a click event listener to each recipe card to display recipe details
        recipeLink.addEventListener('click', () => {
            displayRecipeDetails(recipe.idMeal);
        });

        // appending elements to the recipe card.
        recipeCardBody.appendChild(recipeLink);
        recipeCard.appendChild(recipeImage);
        recipeCard.appendChild(recipeCardBody);
        recipeCol.appendChild(recipeCard);
        row.appendChild(recipeCol);
    });

    // adding the row of recipe cards to the results container
    resultsContainer.appendChild(row);

    // Add the selected recipe to recently searched
    if (recipes.length > 0) {
        addRecentlySearchedRecipe(recipes[0]);
    }
}

// defining a function to display details of a selected recipe
function displayRecipeDetails(recipeId) {
    recipeDetailsContainer.innerHTML = '';
    suggestionsContainer.innerHTML = '';
    resultsContainer.innerHTML = '';

    const detailsUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`;

    fetch(detailsUrl)
        .then(response => response.json())
        .then(data => {
            const recipeDetails = data.meals[0];
            const ingredientsList = getIngredientsList(recipeDetails);
            const recipeDetailsHTML = `
                <div class="card">
                    <h2 class="card-title"><strong>${recipeDetails.strMeal}</strong></h2>
                    <img src="${recipeDetails.strMealThumb}" alt="${recipeDetails.strMeal}" class="card-img-top" style="max-height: 300px; object-fit: cover;">
                    <div class="card-body">
                        <p class="card-text"><strong>Instructions:</strong> ${recipeDetails.strInstructions}</p>
                        <p class="card-text"><strong>Category:</strong> ${recipeDetails.strCategory}</p>
                        <p class="card-text"><strong>Origin of Recipe:</strong> ${recipeDetails.strArea}</p>
                        <p class="card-text"><strong>Dietary Category:</strong> ${recipeDetails.strCategory}</p>
                        <h5 class="card-subtitle mt-4 mb-2"><strong>Ingredients:</strong></h5>
                        <ul>
                            ${ingredientsList.map(ingredient => `<li>${ingredient}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;

            // Display the recipe details on the left column
            recipeDetailsContainer.innerHTML = recipeDetailsHTML;

            // Fetch and display related YouTube videos in the right column (videoDetailsContainer)
            fetchRelatedYouTubeVideos(recipeDetails.strMeal);
        })
        .catch(error => {
            // Handle errors if fetching recipe details fails
            console.error('Error fetching recipe details:', error);
        });
}

// Function to fetch and display related YouTube videos
function fetchRelatedYouTubeVideos(recipeTitle) {
    // Construct the YouTube API search URL
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(recipeTitle)}&key=${youtubeApiKey}&maxResults=5`; // Set maxResults to 5

    // Make a GET request to the YouTube API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Get an array of video IDs from the search results
            const videoIds = data.items.map(item => item.id.videoId);

            // Create a container for the videos
            const videoContainer = document.getElementById('videoDetailsContainer');
            videoContainer.innerHTML = ''; // Clear previous video details

            // Create and append iframes for the related videos
            videoIds.forEach(videoId => {
                const videoIframe = document.createElement('iframe');
                videoIframe.src = `https://www.youtube.com/embed/${videoId}`;
                videoIframe.width = '100%';
                videoIframe.height = '315'; // You can adjust the height as needed
                videoIframe.allowFullscreen = true;

                // Append the video iframe to the video container
                videoContainer.appendChild(videoIframe);
            });
        })
        .catch(error => {
            console.error('Error fetching related YouTube videos:', error);
            const videoContainer = document.getElementById('videoDetailsContainer');
            videoContainer.innerHTML = 'Error fetching related YouTube videos.';
        });
}

// defining a function to create a list of ingredients for a recipe
function getIngredientsList(recipe) {
    const ingredientsList = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        if (ingredient && measure) {
            ingredientsList.push(`${measure} of ${ingredient}`);
        }
    }
    return ingredientsList;
}

//  to add a recipe to the recently searched list
function addRecentlySearchedRecipe(recipe) {
    const recentlySearchedRecipes = JSON.parse(localStorage.getItem('recentlySearchedRecipes')) || [];

    recentlySearchedRecipes.unshift(recipe);

    if (recentlySearchedRecipes.length > maxRecentlySearchedRecipes) {
        recentlySearchedRecipes.pop();
    }

    localStorage.setItem('recentlySearchedRecipes', JSON.stringify(recentlySearchedRecipes));

    displayRecentlySearchedRecipes(recentlySearchedRecipes);
}

// display the recently searched recipes
function displayRecentlySearchedRecipes(recentlySearchedRecipes) {
    recentlySearchedContainer.innerHTML = '';

    recentlySearchedRecipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('col-md-4', 'mb-3');

        //creating the card to show the recupe 
        recipeCard.innerHTML = `
            <div class="card">
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${recipe.strMeal}</h5>
                    <button class="btn btn-primary btn-sm" onclick="fetchRecipes('${recipe.strMeal}')">View Recipe</button>
                </div>
            </div>
        `;

        recentlySearchedContainer.appendChild(recipeCard);
    });
}

// Inside the 'fetchRecipes' function after displaying the fetched recipes
fetchRecipes(searchTerm);
addRecentlySearchedRecipe(suggestions[0]);
