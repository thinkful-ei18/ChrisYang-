'use strict';

const api = (function () {
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/chrisyang';
  
  function getItems(callback) {
    $.getJSON(`${BASE_URL}/items`, callback);
  }

  function createItem(title, description, stars, callback) {
    const newItem = {
      title,
      description,
      stars,
    };
    $.ajax({
      url: `${BASE_URL}/items`,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(newItem),
      success: callback,
    });
  }

  function updateItem(id, updateData, callback) {
    $.ajax({
      url: `${BASE_URL}/items/${id}`,
      method: 'PATCH',
      contentType: 'application/json',
      data: JSON.stringify(updateData),
      success: callback,
    });
  }

  function deleteItem(id, callback) {
    $.ajax({
      url: `${BASE_URL}/items/${id}`,
      method: 'DELETE',
      contentType: 'application/json',
      data: JSON.stringify(),
      success: callback,
    });
  }

  return {
    getItems,
    createItem,
    updateItem,
    deleteItem
  };
}() );