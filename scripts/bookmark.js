'use strict';

/* global store, api*/

const bookmark = (function() {

  function generateBookmarkElement(bookmark) {
    let bookmarkTitle = `
      <i class="fas fa-chevron-circle-down" id="expand"></i>
      <span class="bookmark-title">${bookmark.title}</span>
    `;
    let bookmarkDescription = `<span class="description">${bookmark.desc}</span>`;
    let bookmarkRating = `<span>${bookmark.rating}/5 stars</span>`;
    let bookmarkURL = `
      <a href="${bookmark.url}"><button type="submit">Visit Site</button></a>
    `;
    let editButton  = `
      <button type="submit" class="bookmark-edit">Edit Bookmark</button>
    `;
    let deleteButton = '<button type="submit" class="bookmark-delete">Delete Bookmark</button>';
    if (bookmark.edit) {
      bookmarkTitle = `
          <i class="fas fa-chevron-circle-down" id="expand"></i>
          <label for="bookmark-title">Title:</label>
          <input class="bookmark-edit-title" id="bookmark-title" type="text" value="${bookmark.title}" />
      `;
      bookmarkDescription = `
        <label for="bookmark-descriptions">Description:</label>
        <textarea class="description" id="bookmark-descriptions">${bookmark.desc}</textarea>
      `;
      bookmarkRating = `
        <label for="edit-form">Rating<label>
        <select id="edit-form">
          <option value="1">1-star</option>
          <option value="2">2-stars</option>
          <option value="3">3-stars</option>
          <option value="4">4-stars</option>
          <option value="5">5-stars</option>
        </select>
      `;
      bookmarkURL = `
        <label for="bookmark-url">URL:</label>
        <input class="bookmark-edit-url" type="text" id="bookmark-url" value="${bookmark.url}" />
      `;
      editButton = `
        <button type="submit" class="save-edit">Save Changes</button>
      `;
      deleteButton = `
        <button type="submit" class="undo-edit">Undo Changes</button>
      `;
    }

    return `
    <li class="bookmark" data-item-id="${bookmark.id}">
    <form>
      ${bookmarkTitle}
      <span id="rating">
      ${bookmarkRating}
      </span>
      <div class="openTab" id="${bookmark.id}">
        <div class="bookmark-description">
        ${bookmarkDescription}
          <div class="bookmark-buttons">
            ${editButton}
            ${deleteButton}
            ${bookmarkURL}
          </div>
        <div>
      </div>
    </form>
    </li>
    `;
  }

  function generateNewBookmark() {
    $('.bookmark-add').click(function() {
      event.preventDefault();
      let addItemPage = `
      <li class="add-bookmark-tab">
        <form>
          <label for="bookmark-title">Title:</label>
          <input class="bookmark-edit-title" id="bookmark-title" type="text" placeholder="Enter a Title" />
          <span class="add-star">
            <label for="add-form">Rating<label>
            <select id="add-form">
              <option value="1">1-star</option>
              <option value="2">2-stars</option>
              <option value="3">3-stars</option>
              <option value="4">4-stars</option>
              <option value="5">5-stars</option>
            </select>
          </span>
          <div class="create-description">
          <label for="bookmark-descriptions">Description:</label>
          <textarea class="description" id="bookmark-descriptions" placeholder="Enter a Description"></textarea>
            <div class="create-buttons">
              <label for="bookmark-url">URL:</label>
              <input type="text" class="add-url" id="bookmark-url" placeholder="Enter a URL"></input>
              <div>
                <button type="button" class="add-bookmark">Add Bookmark</button>
                <button type="button" class="cancel-bookmark">Cancel</button>
              <div>
            </div>
          </div>
        </form>
      </li>
      `;
      $('.bookmark-list').html(addItemPage);
    });
  }

  function generateBookmarkString(bookmarks) {
    const items = bookmarks.map((item) => generateBookmarkElement(item));
    return items.join('');
  }

  function getBookmarkIdFromElement(item) {
    return $(item)
      .closest('.bookmark')
      .data('item-id');
  }

  function addBookmark() {
    $('.bookmark-list').on('click', '.add-bookmark', event => {
      event.preventDefault();
      const title = $('.bookmark-edit-title').val();
      const desc = $('.description').val();
      const rating = $('#add-form').val();
      const url = $('.add-url').val();
      api.createItem(title, desc, rating, url, (newItem) => {
        store.addItem(newItem);
        render();
      });
    });
  }

  function cancel() {
    $('.bookmark-list').on('click', '.cancel-bookmark', event => {
      event.preventDefault();
      render();
    });
  }

  function expandBookmark() {
    $('.bookmark-list').on('click', '#expand', event => {
      const id = getBookmarkIdFromElement(event.currentTarget);
      $(`#${id}`).slideToggle();
    });
  }

  function deleteBookmark() {
    $('.bookmark-list').on('click', '.bookmark-delete', event => {
      event.preventDefault();
      const id = getBookmarkIdFromElement(event.currentTarget);
      api.deleteItem(id, () => {
        store.findAndDelete(id);
        render();
      });
    });
  }

  function bookmarkEditItem() {
    $('.bookmark-list').on('click', '.bookmark-edit', event => {
      event.preventDefault();
      const id = getBookmarkIdFromElement(event.currentTarget);
      store.turnOffEdit();
      store.toggleEdit(id);
      render();
      $(`#${id}`).show();
    });
  }

  function saveChanges() {
    $('.bookmark-list').on('click', '.save-edit', event => {
      event.preventDefault();
      const id = getBookmarkIdFromElement(event.currentTarget);
      const title = $('.bookmark-edit-title').val();
      const desc = $('.description').val();
      const rating = $('#edit-form').val();
      const url = $('.bookmark-edit-url').val();
      const updateBookmark = {
        title: title, 
        desc: desc, 
        rating: rating,
        url: url 
      };
      api.updateItem(id, updateBookmark, () => {
        store.findAndUpdateItem(id, updateBookmark);
        render();
        $(`#${id}`).show();
      });
      store.toggleEdit(id);
    });
  }

  function undoChanges() {
    $('.bookmark-list').on('click', '.undo-edit', event => {
      event.preventDefault();
      const id = getBookmarkIdFromElement(event.currentTarget);
      store.turnOffEdit();
      render();
      $(`#${id}`).show();
    });
  }

  function starFilter() {
    $('#star-filter').change(function() {
      render();
    });
  }

  function render() {
    let items = store.items.filter(item => item.rating >= $('#star-filter').val());
    const bookmarkString = generateBookmarkString(items);
    $('.bookmark-list').html(bookmarkString);
  }

  function bindEventListeners() {
    generateNewBookmark();
    addBookmark();
    cancel();
    expandBookmark();
    deleteBookmark();
    bookmarkEditItem();
    saveChanges();
    undoChanges();
    starFilter();
  }

  return {
    render,
    bindEventListeners,
  };
}() );