
//variables
var formTitle = document.querySelector('.form-title');
var formBody = document.querySelector('.form-body');
var saveButton = document.getElementById('save-button');
var ideasContainer = document.querySelector('.ideas-container');
var showFavoritesButton = document.querySelector('.show-favorites-button');
var searchIdeas = document.querySelector('.search-form');
var showFavorites = false;


//event listeners
saveButton.addEventListener('click', onSave);
formTitle.addEventListener('keydown', validateForm);
formBody.addEventListener('keydown', validateForm);
searchIdeas.addEventListener('keyup', filterIdeas);
showFavoritesButton.addEventListener('click', toggleFavorites);

displayIdeas();

//functions
function onSave() {
  var title = formTitle.value;
  var body = formBody.value;
  var id = uuidv4();
  var star = false;

  var newIdea = new Idea(id, title, body, star);
  
  newIdea.saveToStorage();
    
  displayIdeas();
  clearFields();
}

function clearFields() {
  formTitle.value = '';
  formBody.value = '';

  saveButton.setAttribute("disabled", true);
}

function deleteIdea(e) {
  var ideaId = e.path.find((element) => element.dataset.ideaId).dataset.ideaId;

  Idea.deleteFromStorage(ideaId);

  displayIdeas();

}

function displayIdeas(query) {
  if (showFavorites) {
    var ideas = JSON.parse(localStorage.getItem('ideas')).filter((idea) => idea.star);  
  } else {
    ideas = JSON.parse(localStorage.getItem('ideas'));
  }

  if (query) {
    ideas = ideas.filter((idea) => idea.title.includes(query) || idea.body.includes(query));
  }
  
  if (ideas) {
    var innerHtml = ideas.map((idea) => {
      var favorite = "assets/star.svg";

      if (idea.star) {
        favorite = "assets/star-active.svg";
      }

      return `
      <div class="idea-container" data-idea-id=${idea.id}>
        <div class="favorite-delete-container">
          <img src=${favorite} class="svg favorite"/>
          <div class="delete">
            <img src="assets/delete.svg" class="svg"/>
          </div>
        </div>
        <div class="idea-body-container">
          <h3>${idea.title}</h3>
          <h4>${idea.body}</h4>
        </div>
        <div class="comment-container">
          <img src="assets/comment.svg" class="svg"/><h5 class="comment-text">Comment</h5>
        </div>
      </div>
      `
    });
  
    ideasContainer.innerHTML = innerHtml;

    var deleteButtons = document.querySelectorAll('.delete');
    deleteButtons.forEach((button) => {
      button.addEventListener('click', (e) => deleteIdea(e))
    });

    var favoriteButtons = document.querySelectorAll('.favorite');
    favoriteButtons.forEach((button) => {
      button.addEventListener('click', (e) => favoriteIdea(e))
    });
  }
}

function favoriteIdea(e) {
  var ideaId = e.path.find((element) => element.dataset.ideaId).dataset.ideaId;

  Idea.updateIdea(ideaId);

  displayIdeas();
}

function filterIdeas() {
  var query = searchIdeas.value;

  displayIdeas(query);
}

function toggleFavorites() {
  showFavorites = !showFavorites;

  if (showFavorites) {
    showFavoritesButton.innerHTML = "<p>Show All Ideas</p>";
  } else {
    showFavoritesButton.innerHTML = "<p>Show Starred Ideas</p>";
  }

  displayIdeas();
}

  function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


function validateForm() {
  var title = formTitle.value;
  var body = formBody.value;

  if (title && body) {
    saveButton.removeAttribute("disabled");
  } else {
    saveButton.setAttribute("disabled", true);
  }
}


