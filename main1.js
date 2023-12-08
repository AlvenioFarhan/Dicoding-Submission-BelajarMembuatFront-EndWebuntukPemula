/**
 * [
 *    {
 *      id: <int>
 *      bookTitle: <string>
 *      bookAuthor: <string>
 *      bookYear: <string>
 *      isCompleted: <boolean>
 *    }
 * ]
 */

const bookSubmit = [];
const RENDER_EVENT = "render-bookshelf";
const SAVED_EVENT = "saved-bookshelf";
const STORAGE_KEY = "BOOKSHELF_APPS";

function generateId() {
  return +new Date();
}

function generateBookshelfAppObject(
  id,
  bookTitle,
  bookAuthor,
  bookYear,
  isCompleted
) {
  return {
    id,
    bookTitle,
    bookAuthor,
    bookYear,
    isCompleted,
  };
}

function findBookshelf(bookshelfId) {
  for (const bookshelfItem of bookSubmit) {
    if (bookshelfItem.id === bookshelfId) {
      return bookshelfItem;
    }
  }
  return null;
}

function findBookshelfIndex(bookshelfId) {
  for (const index in bookSubmit) {
    if (bookSubmit[index].id === bookshelfId) {
      return index;
    }
  }
  return -1;
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(bookSubmit);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const todo of data) {
      todos.push(todo);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBookshelf(bookshelfObject) {
  const { id, bookTitle, bookAuthor, bookYear, isCompleted } = bookshelfObject;

  const textTitle = document.createElement("h3");
  textTitle.innerText = bookTitle;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = bookAuthor;

  const textTimestamp = document.createElement("p");
  textTimestamp.innerText = bookYear;

  const textContainer = document.createElement("div");
  textContainer.classList.add("book_shelf");
  textContainer.append(textTitle, textAuthor, textTimestamp);

  const container = document.createElement("div");
  container.classList.add("book_item", "action");
  container.append(textContainer);
  container.setAttribute("id", `todo-${id}`);

  if (isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("green");
    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("red");
    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("green");
    checkButton.addEventListener("click", function () {
      addTaskToCompleted(id);
    });

    container.append(checkButton);
  }

  return container;
}

function addBookshelf() {
  const textBookshelf = document.getElementById("inputBookTitle").value;
  const textAuthor = document.getElementById("inputBookAuthor").value;
  const timestamp = document.getElementById("inputBookYear").value;

  const generatedID = generateId();
  const bookshelfObject = generateBookshelfObject(
    generatedID,
    textBookshelf,
    textAuthor,
    timestamp,
    false
  );
  todos.push(bookshelfObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBookTitleToCompleted(bookshelfId) {
  const bookshelfTarget = findTodo(bookshelfId);

  if (bookshelfTarget == null) return;

  bookshelfTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookTitleFromCompleted(bookshelfId) {
  const bookshelfTarget = findBookshelfIndex(bookshelfId);

  if (bookshelfTarget === -1) return;

  bookSubmit.splice(bookshelfTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookTitleFromCompleted(bookshelfId) {
  const bookshelfTarget = findBookshelf(bookshelfId);
  if (bookshelfTarget == null) return;

  bookshelfTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBookshelf();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log("Data berhasil di simpan.");
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBOOKSHELFList = document.getElementById("bookSubmit");
  const listCompleted = document.getElementById("completed-bookSubmit");

  uncompletedBOOKSHELFList.innerHTML = "";
  listCompleted.innerHTML = "";

  for (const bookshelfItem of bookSubmit) {
    const bookshelfElement = makeTodo(bookshelfItem);
    if (bookshelfItem.isCompleted) {
      listCompleted.append(bookshelfElement);
    } else {
      uncompletedBOOKSHELFList.append(bookshelfElement);
    }
  }
});
