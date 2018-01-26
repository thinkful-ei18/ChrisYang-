'use strict';

const api = (function () {
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/chrisyang';
  
  function getBookmarks(callback) {
    $.getJSON(`${BASE_URL}/bookmarks`, callback);
  }

  function createItem(title, description, stars, url, callback) {
    const newItem = JSON.stringify({
      title,
      desc: description,
      rating: stars,
      url,
    });
    $.ajax({
      url: `${BASE_URL}/bookmarks`,
      method: 'POST',
      contentType: 'application/json',
      data: newItem,
      success: callback,
    });
  }

  function updateItem(id, updateData, callback) {
    $.ajax({
      url: `${BASE_URL}/bookmarks/${id}`,
      method: 'PATCH',
      contentType: 'application/json',
      data: JSON.stringify(updateData),
      success: callback,
    });
  }

  function deleteItem(id, callback) {
    $.ajax({
      url: `${BASE_URL}/bookmarks/${id}`,
      method: 'DELETE',
      contentType: 'application/json',
      data: JSON.stringify(),
      success: callback,
    });
  }

  return {
    getBookmarks,
    createItem,
    updateItem,
    deleteItem
  };
}() );