
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
searchIdeas.addEventListener('keyup', filterIdeas)
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

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function clearFields() {
  formTitle.value = '';
  formBody.value = '';

  saveButton.setAttribute("disabled", true);
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

function deleteIdea(e) {
  var ideaId = e.path.find((element) => {
    return element.dataset.ideaId
  }).dataset.ideaId;

  Idea.deleteFromStorage(ideaId);

  if (showFavorites) {
    var favoriteIdeas = JSON.parse(localStorage.getItem('ideas')).filter((idea) => idea.star);
    displayIdeas(favoriteIdeas);
  } else {
    displayIdeas();
  }
}

function favoriteIdea(e) {
  var ideaId = e.path.find((element) => {
    return element.dataset.ideaId
  }).dataset.ideaId;

  Idea.updateIdea(ideaId);

  displayIdeas();
}

function filterIdeas() {
  var input = searchIdeas.value;

  var ideas = JSON.parse(localStorage.getItem('ideas'));

  if (showFavorites) {
    var filtered = ideas.filter((idea) => {
      return idea.star
    }).filter((favorite) => {
      return favorite.title.includes(input) || favorite.body.includes(input)
    });

    displayIdeas(filtered)
  } else {
    var filtered = ideas.filter((idea) => {
      console.log(idea.title)
      return idea.title.includes(input) || idea.body.includes(input)
    });

    displayIdeas(filtered)
  }
}

function toggleFavorites() {
  showFavorites = !showFavorites;

  if (showFavorites) {
    var favoriteIdeas = JSON.parse(localStorage.getItem('ideas')).filter((idea) => idea.star);
    displayIdeas(favoriteIdeas);
    showFavoritesButton.innerHTML = "Show All Ideas";
  } else {
    displayIdeas();
    showFavoritesButton.innerHTML = "Show Starred Ideas";
  }
}

function displayIdeas(favorites) {
  if (favorites) {
    var ideas = favorites
  } else {
    ideas = JSON.parse(localStorage.getItem('ideas'));
  }
  
  if (ideas) {
    var innerHtml = ideas.map((idea) => {
        var favorite = "assets/star.svg"

      if (idea.star) {
        favorite = "assets/star-active.svg"
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
    })
  
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

