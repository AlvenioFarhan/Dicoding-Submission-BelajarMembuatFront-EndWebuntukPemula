document.addEventListener("DOMContentLoaded", function () {
  const inputBookForm = document.getElementById("inputBook");
  const searchBookForm = document.getElementById("searchBook");

  inputBookForm.addEventListener("submit", function (e) {
    e.preventDefault();
    addBookshelf();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }

  searchBookForm.addEventListener("submit", function (e) {
    e.preventDefault();
    searchBook();
  });
});

function addBookshelf() {
  const textBookshelf = document.getElementById("inputBookTitle").value;
  const textAuthor = document.getElementById("inputBookAuthor").value;
  const timestamp = document.getElementById("inputBookYear").value;

  const yearNumber = Number(timestamp);

  const generatedID = generateId();
  const bookshelfObject = generateBookshelfObject(
    generatedID,
    textBookshelf,
    textAuthor,
    yearNumber,
    false
  );
  bookshelfs.push(bookshelfObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}

function generateBookshelfObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

const bookshelfs = [];
const RENDER_EVENT = "render-bookshelf";

document.addEventListener(RENDER_EVENT, function () {
  // console.log(bookshelfs);

  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  incompleteBookshelfList.innerHTML = "";

  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );
  completeBookshelfList.innerHTML = "";

  for (const bookshelfItem of bookshelfs) {
    const bookshelfElement = makeBookshelf(bookshelfItem);
    if (!bookshelfItem.isComplete) {
      incompleteBookshelfList.append(bookshelfElement);
    } else {
      completeBookshelfList.append(bookshelfElement);
    }
  }
});

function makeBookshelf(bookshelfObject) {
  const textBookTitle = document.createElement("h3");
  textBookTitle.innerText = bookshelfObject.title;

  const textBookAuthor = document.createElement("p");
  textBookAuthor.innerText = `Penulis: ${bookshelfObject.author}`;

  const textBookYear = document.createElement("p");
  textBookYear.innerText = `Tahun : ${bookshelfObject.year}`;

  const action = document.createElement("div");
  action.classList.add("action");

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(textBookTitle, textBookAuthor, textBookYear, action);

  if (bookshelfObject.isComplete) {
    const greenButton = document.createElement("button");
    greenButton.classList.add("green");
    greenButton.innerText = `Belum selesai di Baca`;

    greenButton.addEventListener("click", function () {
      greenButtonFromIncompleted(bookshelfObject.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("red");
    deleteButton.innerText = `Hapus buku`;

    deleteButton.addEventListener("click", function () {
      deleteButtonFromCompleted(bookshelfObject.id);
    });

    action.append(greenButton, deleteButton);
  } else {
    const greenButton = document.createElement("button");
    greenButton.classList.add("green");
    greenButton.innerText = `Selesai dibaca`;

    greenButton.addEventListener("click", function () {
      greenButtonFromCompleted(bookshelfObject.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("red");
    deleteButton.innerText = `Hapus buku`;

    deleteButton.addEventListener("click", function () {
      deleteButtonFromCompleted(bookshelfObject.id);
    });

    action.append(greenButton, deleteButton);
  }

  return container;
}

//button green Selesai Dibaca
function greenButtonFromCompleted(bookshelfId) {
  const bookshelftTarget = findBookshelf(bookshelfId);

  if (bookshelftTarget == null) return;

  bookshelftTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

//button red hapus buku
function deleteButtonFromCompleted(bookshelfId) {
  const bookshelftTarget = findBookshelfIndex(bookshelfId);

  if (bookshelftTarget === -1) return;

  bookshelfs.splice(bookshelftTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookshelfIndex(bookshelfId) {
  for (const index in bookshelfs) {
    if (bookshelfs[index].id === bookshelfId) {
      return index;
    }
  }
  return -1;
}

//button green belum selesai dibaca
function greenButtonFromIncompleted(bookshelfId) {
  const bookshelfTarget = findBookshelf(bookshelfId);

  if (bookshelfTarget == null) return;

  bookshelfTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookshelf(bookshelfId) {
  for (const bookshelfItem of bookshelfs) {
    if (bookshelfItem.id === bookshelfId) {
      return bookshelfItem;
    }
  }
  return null;
}

//localstorage
const SAVED_EVENT = "saved-bookshelf";
const STORAGE_KEY = "BOOKSHELF-APPS";

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(bookshelfs);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

//testing
// document.addEventListener(SAVED_EVENT, function () {
//   console.log(localStorage.getItem(STORAGE_KEY));
// });

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const bookshelf of data) {
      bookshelfs.push(bookshelf);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

//searchbook
function searchBook() {
  const searchTitleInput = document.getElementById("searchBookTitle");
  const searchTitle = searchTitleInput.value.toLowerCase();

  const allBooks = document.querySelectorAll(".book_item");
  allBooks.forEach(function (bookItem) {
    const title = bookItem.querySelector("h3").innerText.toLowerCase();

    if (title.includes(searchTitle)) {
      bookItem.style.display = "block";
    } else {
      bookItem.style.display = "none";
    }
  });
}
