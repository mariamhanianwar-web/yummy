// Side Menu
let openBtn = document.getElementById("openMenu");
let closeBtn = document.getElementById("closeBtn");
let sideMenu = document.getElementById("sideMenu");
openBtn.onclick = () => sideMenu.classList.add("open");
closeBtn.onclick = () => sideMenu.classList.remove("open");
let content = document.getElementById("content");
//API FUNCTIONS 
async function getMealsByName(name = "") {
    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
    let res = await data.json();
    return res.meals ? res.meals.slice(0, 20) : [];
}
async function getMealsByLetter(letter) {
    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    let res = await data.json();
    return res.meals ? res.meals.slice(0, 20) : [];
}
async function getCategories() {
    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    let res = await data.json();
    displayCategories(res.categories);
}
async function getMealsByCategory(cat) {
    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`);
    let res = await data.json();
    displayMeals(res.meals.slice(0, 20));
}
async function getAreas() {
    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    let res = await data.json();
    displayAreas(res.meals);
}
async function getMealsByArea(area) {
    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    let res = await data.json();
    displayMeals(res.meals.slice(0, 20));
}
async function getIngredients() {
    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    let res = await data.json();
    displayIngredients(res.meals.slice(0, 20));
}
async function getMealsByIngredient(ing) {
    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ing}`);
    let res = await data.json();
    displayMeals(res.meals.slice(0, 20));
}
async function getMealDetails(id) {
    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    let res = await data.json();
    displayMealDetails(res.meals[0]);
}
// DISPLAY FUNCTIONS 
function displayMeals(meals) {
    content.innerHTML = "";
    meals.forEach(meal => {
        content.innerHTML += `
        <div class="col-md-3">
            <div class="meal" onclick="getMealDetails('${meal.idMeal}')">
                <img src="${meal.strMealThumb}" class="w-100 rounded">
                <h5 class="text-center mt-2">${meal.strMeal}</h5>
            </div>
        </div>`;
    });
}
function displayCategories(categories) {
    content.innerHTML = "";
    categories.forEach(cat => {
        content.innerHTML += `
        <div class="col-md-3 cursor-pointer" onclick="getMealsByCategory('${cat.strCategory}')">
            <img src="${cat.strCategoryThumb}" class="w-100 rounded">
            <h5 class="text-center mt-2">${cat.strCategory}</h5>
        </div>`;
    });
}
function displayAreas(areas) {
    content.innerHTML = "";
    areas.forEach(ar => {
        content.innerHTML += `
        <div class="col-md-3 text-center cursor-pointer" onclick="getMealsByArea('${ar.strArea}')">
            <i class="fa-solid fa-city fa-3x"></i>
            <h4 class="mt-2">${ar.strArea}</h4>
        </div>`;
    });
}
function displayIngredients(ingredients) {
    content.innerHTML = "";
    ingredients.forEach(ing => {
        content.innerHTML += `
        <div class="col-md-3 cursor-pointer" onclick="getMealsByIngredient('${ing.strIngredient}')">
            <i class="fa-solid fa-bowl-food fa-3x"></i>
            <h4>${ing.strIngredient}</h4>
            <p>${ing.strDescription?.split(" ").slice(0, 15).join(" ")}...</p>
        </div>`;
    });
}
function displayMealDetails(meal) {
    content.innerHTML = `
    <div class="col-md-4">
        <img src="${meal.strMealThumb}" class="w-100 rounded">
        <h2 class="mt-3">${meal.strMeal}</h2>
    </div>
    <div class="col-md-8">
        <h3>Instructions</h3>
        <p>${meal.strInstructions}</p>
        <h5>Area: ${meal.strArea}</h5>
        <h5>Category: ${meal.strCategory}</h5>
        <h4 class="mt-3">Recipes:</h4>
        <ul id="recipes"></ul>
        <h4 class="mt-3">Tags:</h4>
        <p>${meal.strTags ? meal.strTags : "None"}</p>
        <a href="${meal.strSource}" target="_blank" class="btn btn-success mt-3">Source</a>
        <a href="${meal.strYoutube}" target="_blank" class="btn btn-danger mt-3">YouTube</a>
    </div>`;
    let recipesList = "";
    for (let i = 1; i <= 20; i++) {
        let ing = meal[`strIngredient${i}`];
        let mea = meal[`strMeasure${i}`];
        if (ing) {
            recipesList += `<span class="recipe-badge">${mea} ${ing}</span>`;
        }
    }
    document.getElementById("recipes").innerHTML = recipesList;
}
// SEARCH PAGE
function showSearch() {
    content.innerHTML = `
    <div class="col-md-6">
        <input class="form-control" placeholder="Search by name" onkeyup="searchByName(this.value)">
    </div>
    <div class="col-md-6">
        <input maxlength="1" class="form-control" placeholder="Search by first letter" onkeyup="searchByLetter(this.value)">
    </div>`;
}
async function searchByName(name) {
    let meals = await getMealsByName(name);
    displayMeals(meals);
}
async function searchByLetter(letter) {
    if (letter.length == 1) {
        let meals = await getMealsByLetter(letter);
        displayMeals(meals);
    }
}
//  CONTACT PAGE
function showContact() {
    content.innerHTML = `
    <div class="col-md-6 mx-auto">
        <input id="name" class="form-control mt-3" placeholder="Name" oninput="validate()">
        <input id="email" class="form-control mt-3" placeholder="Email" oninput="validate()">
        <input id="phone" class="form-control mt-3" placeholder="Phone" oninput="validate()">
        <input id="age" class="form-control mt-3" placeholder="Age" oninput="validate()">
        <input id="password" class="form-control mt-3" placeholder="Password" oninput="validate()" type="password">
        <input id="repassword" class="form-control mt-3" placeholder="Re-password" oninput="validate()" type="password">
        <button id="submitBtn" class="btn btn-danger w-100 mt-4" disabled>Submit</button>
    </div>`;
}
function validate() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let age = document.getElementById("age").value;
    let pass = document.getElementById("password").value;
    let repass = document.getElementById("repassword").value;

    let nameValid = /^[A-Za-z ]+$/.test(name);
    let emailValid = /^[^@]+@[^@]+\.[^@]+$/.test(email);
    let phoneValid = /^[0-9]{10,15}$/.test(phone);
    let ageValid = /^[0-9]{1,3}$/.test(age);
    let passValid = /^[A-Za-z0-9]{6,}$/.test(pass);
    let repassValid = pass === repass;

    if (nameValid && emailValid && phoneValid && ageValid && passValid && repassValid) {
        document.getElementById("submitBtn").disabled = false;
    } else {
        document.getElementById("submitBtn").disabled = true;
    }
}
// INITIAL LOAD 
(async () => {
    let meals = await getMealsByName("");
    displayMeals(meals);
})();
