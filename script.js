document.addEventListener("DOMContentLoaded", function () {
  const inputBookForm = document.getElementById("inputBook");
  const searchBookForm = document.getElementById("searchBook");
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  inputBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  searchBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });

  function createBook(title, author, year, isComplete) {
    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item");

    const titleElement = document.createElement("h3");
    titleElement.innerText = title;

    const authorElement = document.createElement("p");
    authorElement.innerText = `Penulis: ${author}`;

    const yearElement = document.createElement("p");
    yearElement.innerText = `Tahun: ${year}`;

    const actionElement = document.createElement("div");
    actionElement.classList.add("action");

    const toggleButton = document.createElement("button");
    toggleButton.classList.add(isComplete ? "green" : "red");
    toggleButton.innerText = isComplete
      ? "Belum selesai di Baca"
      : "Selesai dibaca";
    toggleButton.addEventListener("click", function () {
      toggleBookStatus(bookItem, isComplete);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("red");
    deleteButton.innerText = "Hapus buku";
    deleteButton.addEventListener("click", function () {
      deleteBook(bookItem);
    });

    actionElement.appendChild(toggleButton);
    actionElement.appendChild(deleteButton);

    bookItem.appendChild(titleElement);
    bookItem.appendChild(authorElement);
    bookItem.appendChild(yearElement);
    bookItem.appendChild(actionElement);

    return bookItem;
  }

  function addBook() {
    const titleInput = document.getElementById("inputBookTitle");
    const authorInput = document.getElementById("inputBookAuthor");
    const yearInput = document.getElementById("inputBookYear");
    const isCompleteInput = document.getElementById("inputBookIsComplete");

    const title = titleInput.value;
    const author = authorInput.value;
    const year = yearInput.value;
    const isComplete = isCompleteInput.checked;

    const bookItem = createBook(title, author, year, isComplete);

    if (isComplete) {
      completeBookshelfList.appendChild(bookItem);
    } else {
      incompleteBookshelfList.appendChild(bookItem);
    }

    resetForm();
  }

  function resetForm() {
    inputBookForm.reset();
  }

  function toggleBookStatus(bookItem, isComplete) {
    if (isComplete) {
      incompleteBookshelfList.appendChild(bookItem);
    } else {
      completeBookshelfList.appendChild(bookItem);
    }

    const toggleButton = bookItem.querySelector(".action button");
    toggleButton.classList.toggle("green");
    toggleButton.classList.toggle("red");
    toggleButton.innerText = isComplete
      ? "Selesai dibaca"
      : "Belum selesai di Baca";
  }

  function deleteBook(bookItem) {
    const parentList = bookItem.parentElement;
    parentList.removeChild(bookItem);
  }

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
});
