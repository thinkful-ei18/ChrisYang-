'use strict';

const bookmark = (function() {

  function generateItemElement(item) {
    let itemTitle = `<span class="bookmark-title">${item.title}</span>`;
    let itemDescription = `<span class="description">${item.desc}</span>`;
    let itemStars = `<span>${item.rating}/5 stars</span>`;
    let itemURL = `<a href="${item.url}"><button type="submit">Visit Site</button></a>`;
    let editButton  = '<button type="submit" class="bookmark-edit">Edit Bookmark</button>';
    let deleteButton = '<button type="submit" class="bookmark-delete">Delete Bookmark</button>';
    if (item.edit) {
      itemTitle = `
        <form id="bookmark-edit-item">
          <input class="bookmark-edit-title" type="text" value="${item.title}" />
        </form>
      `;
      itemDescription = `<textarea class="description">${item.desc}</textarea>`;
      itemStars = `
        <select class="edit-star">
          <option value="1">1-star</option>
          <option value="2">2-star</option>
          <option value="3">3-star</option>
          <option value="4">4-star</option>
          <option value="5">5-star</option>
        </select>
      `;
      itemURL = `
        <input class="bookmark-edit-url" type="text" value="${item.url}" />
      `;
      editButton = `
        <button type="submit" class="save-edit">Save Changes</button>
      `;
      deleteButton = `
        <button type="submit" class="undo-edit">Undo Changes</button>
      `;
    }

    return `
    <li class="bookmark" data-item-id="${item.id}">
      ${itemTitle}
      <div class="rating">
      ${itemStars}
      </div>
      <div class="openTab" id="${item.id}">
        <div class="bookmark-description">
        ${itemDescription}
          <div class="bookmark-buttons">
            ${editButton}
            ${deleteButton}
            ${itemURL}
          </div>
        <div>
      </div>
    </li>
    `;
  }

  function generateBookmarkItemsString(bookmarks) {
    const items = bookmarks.map((item) => generateItemElement(item));
    return items.join('');
  }

  function generateNewItem() {
    $('.bookmark-add').click(function() {
      event.preventDefault();
      let addItemPage = `
      <li class="add-bookmark-tab">
        <form>
          <input class="bookmark-edit-title" type="text" placeholder="Enter a Title" />
          <select class="add-star">
            <option value="1">1-star</option>
            <option value="2">2-star</option>
            <option value="3">3-star</option>
            <option value="4">4-star</option>
            <option value="5">5-star</option>
          </select>
          <div class="create-description">
          <textarea class="description" placeholder="Enter a Description"></textarea>
            <div class="create-buttons">
              <input type="text" class="add-url" placeholder="Enter a URL"></input>
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

  function addItem() {
    $('.bookmark-list').on('click', '.add-bookmark', event => {
      event.preventDefault();
      const title = $('.bookmark-edit-title').val();
      const desc = $('.description').val();
      const rating = $('.add-star').val();
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

  function getItemIdFromElement(item) {
    return $(item)
      .closest('.bookmark')
      .data('item-id');
  }

  function expandItem() {
    $('.bookmark-list').on('click', '.bookmark-title', event => {
      const id = getItemIdFromElement(event.currentTarget);
      $(`#${id}`).slideToggle();
    });
  }

  function bookmarkEditItem() {
    $('.bookmark-list').on('click', '.bookmark-edit', event => {
      event.preventDefault();
      const id = getItemIdFromElement(event.currentTarget);
      store.turnOffEdit();
      store.toggleEdit(id);
      render();
      $(`#${id}`).show();
    });
  }

  function saveChanges() {
    $('.bookmark-list').on('click', '.save-edit', event => {
      event.preventDefault();
      const id = getItemIdFromElement(event.currentTarget);
      const title = $('.bookmark-edit-title').val();
      const desc = $('.description').val();
      const rating = $('.edit-star').val();
      const url = $('.bookmark-edit-url').val();
      // store.findAndUpdateItem(id, title, desc, rating, url);
      api.updateItem(id, { title: title }, () => {
        store.findAndUpdateItem(id, { title: title });
        render();
        $(`#${id}`).show();
      });
      api.updateItem(id, { desc: desc }, () => {
        store.findAndUpdateItem(id, { desc: desc });
        render();
        $(`#${id}`).show();
      });
      api.updateItem(id, { rating: rating }, () => {
        store.findAndUpdateItem(id, { rating: rating });
        render();
        $(`#${id}`).show();
      });
      api.updateItem(id, { url: url }, () => {
        store.findAndUpdateItem(id, { url: url });
        render();
        $(`#${id}`).show();
      });
      store.toggleEdit(id);
    });
  }

  function undoChanges() {
    $('.bookmark-list').on('click', '.undo-edit', event => {
      event.preventDefault();
      const id = getItemIdFromElement(event.currentTarget);
      store.turnOffEdit();
      render();
      $(`#${id}`).show();
    });
  }

  function deleteItemClicked() {
    // like in `handleItemCheckClicked`, we use event delegation
    $('.bookmark-list').on('click', '.bookmark-delete', event => {
      // get the index of the item in store.items
      const id = getItemIdFromElement(event.currentTarget);
      api.deleteItem(id, () => {
        store.findAndDelete(id);
        render();
      });
    });
  }

  function starFilter() {
    $('.stars').change(function() {
      render();
    });
  }

  function bookmarkSearch() {
    $('.bookmark-search').on('keyup', event => {
      const val = $(event.currentTarget).val();
      store.setSearchTerm(val);
      render();
    });
  }

  function render() {
    // Filter item list if store prop is true by item.checked === false
    let items = store.items.filter(item => item.rating >= $('.stars').val());
  
    // render the shopping list in the DOM
    const bookmarkItemsString = generateBookmarkItemsString(items);
  
    // insert that HTML into the DOM
    $('.bookmark-list').html(bookmarkItemsString);
  }

  function bindEventListeners() {
    expandItem();
    bookmarkEditItem();
    deleteItemClicked();
    generateNewItem();
    addItem();
    saveChanges();
    undoChanges();
    starFilter();
    bookmarkSearch();
    cancel();
  }

  return {
    render,
    bindEventListeners,
  };
}() );