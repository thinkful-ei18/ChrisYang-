'use strict';

const Item = (function() {

  function validateItem(title, desc, rating, url) {
    if (!title) {
      throw new TypeError('Title cannot be blank');
    } 
    if (!desc) {
      throw new TypeError('Description cannot be blank');
    }
    if (!rating) {
      throw new TypeError('Stars cannot be blank');
    } 
    if (!url) {
      throw new TypeError('URL cannot be blank');
    }
  }
  
  function create(title, desc, rating, url) {
    return {
      id: cuid(),
      title,
      desc,
      rating,
      url
    };
  }

  return {
    validateItem,
    create,
  };
}() );

