'use strict';

$(document).ready(function() {
  bookmark.bindEventListeners();
  bookmark.render();

  api.getBookmarks((bookmarks) => {
    bookmarks.forEach((bookmark) => store.addItem(bookmark));
    bookmark.render();
  });
});