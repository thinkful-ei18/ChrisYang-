'use strict';

/* global bookmark, store, api */

$(document).ready(function() {
  bookmark.bindEventListeners();
  bookmark.render();

  api.getBookmarks((bookmarks) => {
    bookmarks.forEach((bookmark) => store.addItem(bookmark));
    bookmark.render();
  });
});