import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js';
import recipeView from '../views/recipeView.js';
import searchView from '../views/searchView.js';
import resultView from '../views/resultView.js';
import paginationView from '../views/paginationView.js';
import bookmarkViews from '../views/bookmarkViews.js';
import addRecipeView from '../views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// RENDER SPINNER

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0. update result view to mark selected search result
    resultView.update(model.getSearchResultsPage());

    // 3 updating bookmarks view
    bookmarkViews.update(model.state.bookmarks);
    // 1. LOADING RECIPE
    await model.loadRecipe(id);

    // 2. RENDERING RECIPE
    recipeView.render(model.state.recipe);
  } catch (error) {
    console.log(error);
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    resultView.renderSpinner();
    // 1. get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. load search results
    await model.loadSearchResult(query);

    // 3 render results
    // resultView.render(model.state.search.results);
    resultView.render(model.getSearchResultsPage());

    // 4 render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // render new result
  // resultView.render(model.state.search.results);
  resultView.render(model.getSearchResultsPage(goToPage));

  //  render new pagination buttons
  paginationView.render(model.state.search);
};

controlSearchResult();

const controlUpdateServings = function (newServings) {
  // UPDATE THE RECIPE SERVINGS
  model.updateServings(newServings);
  // UPDATE THE RECIPE VIEW

  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1. Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmarks(model.state.recipe.id);

  console.log(model.state.recipe);
  console.log('bookmarked');
  //2. update recipe view
  recipeView.update(model.state.recipe);

  // 3. render bookmarks
  bookmarkViews.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarkViews.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  // upload the new recipe
  try {
    await model.uploadRecipe(newRecipe);

    // render recipe
    recipeView.render(model.state.recipe);

    // success message
    addRecipeView.renderSuccessMessage();

    // render bookmarks view
    bookmarkViews.render(model.state.bookmarks);

    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.log(error, '🎇');
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  bookmarkViews.addHandler(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlUpdateServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.searchHandler(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

// window.addEventListener('load', showRecipe);
// window.addEventListener('hashchange', showRecipe);
