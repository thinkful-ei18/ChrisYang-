'use strict';

const Item = (function() {

  function validateItem(title, description, stars, URL) {
    if (!title) {
      throw new TypeError('Title cannot be blank');
    } 
    if (!description) {
      throw new TypeError('Description cannot be blank');
    }
    if (!stars) {
      throw new TypeError('Stars cannot be blank');
    } 
    if (!URL) {
      throw new TypeError('URL cannot be blank');
    }
  }
  
  function create(title, description, stars, URL) {
    return {
      id: cuid(),
      title,
      description,
      stars,
      URL
    };
  }

  return {
    validateItem,
    create,
  };
}() );

