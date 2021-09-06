class Idea {
  id;
  title;
  body;
  star;

  constructor(id, title, body, star) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.star = star; 
  }
  
  saveToStorage() {
    var ideas = JSON.parse(localStorage.getItem('ideas'));

    if (!ideas) {
      ideas = [];
    }

    ideas.push(this);

    localStorage.setItem('ideas', JSON.stringify(ideas));
  }

  static deleteFromStorage(ideaId) {
    var ideas = JSON.parse(localStorage.getItem('ideas'));

    if (ideas) {
      ideas = ideas.filter((idea) => idea.id !== ideaId);

      localStorage.setItem('ideas', JSON.stringify(ideas));
    }
  }

  static updateIdea(ideaId) {
    var ideas = JSON.parse(localStorage.getItem('ideas'));

    var index = ideas.findIndex((idea) => idea.id == ideaId);

    ideas[index].star = !ideas[index].star;

    localStorage.setItem('ideas', JSON.stringify(ideas));
  }
}

