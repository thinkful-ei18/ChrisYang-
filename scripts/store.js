'use strict';

const store = (function() {

  function addItem(bookmark) {
    this.items.push(bookmark);
  }

  function findById(id) {
    return this.items.find(item => item.id === id);
  }

  function findAndDelete(id) {
    this.items = this.items.filter(item => item.id !== id);
  }

  function findAndUpdateItem(id, newData) {
    const item = this.findById(id);
    Object.assign(item, newData);
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
    ],
    amountOfStars: 0,
    searchTerm: '',

    addItem,
    findById,
    findAndDelete,
    findAndUpdateItem,
    turnOffEdit,
    toggleEdit,
  };
}() );