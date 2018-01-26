'use strict';

const store = (function() {

  function addItem(title, description, stars, URL) {
    const item = Item.create(title, description, stars, URL);
    try {
      Item.validateItem(title, description, stars, URL);
      this.items.push(item);
    } catch(e) {
      console.log(e.message);
    }
  }

  function findById(id) {
    return this.items.find(item => item.id === id);
  }

  function findAndDelete(id) {
    this.items = this.items.filter(item => item.id !== id);
  }

  function findAndUpdateItem(id, title, description, stars, URL) {
    try {
      Item.validateItem(title, description, stars, URL);
      const item = this.findById(id);
      item.title = title;
      item.description = description;
      item.stars = stars;
      item.URL = URL;
    } catch(e) {
      console.log('Cannot update name: ' + e.message);
    }
  }

  function turnOffEdit() {
    this.items.map(item => item.edit = false);
  }

  function toggleEdit(id) {
    const item = this.findById(id);
    item.edit = !item.edit;
  }

  return {
    items: [
      {id: cuid(), title: 'Bookmark', description: 'Hello!', stars: 4, URL: 'https://www.google.com/', edit: false},
      {id: cuid(), title: 'Hello', description: 'Description', stars: 3, URL: 'https://www.google.com/', edit: false},
      {id: cuid(), title: 'Hi', description: 'Description', stars: 5, URL: 'https://www.google.com/', edit: false},
      {id: cuid(), title: 'MarkMark', description: 'Description', stars: 2, URL: 'https://www.google.com/', edit: false}
    ],
    amountOfStars: 0,
    searchTerm: '',

    findById,
    addItem,
    findAndDelete,
    findAndUpdateItem,
    turnOffEdit,
    toggleEdit,
  };
}() );