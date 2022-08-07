const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

function generateId() {
  return +new Date();
}

function generateBookObject(id, bookTitle, bookAuthor, bookYear, isComplete) {
  return {
    id,
    bookTitle,
    bookAuthor,
    bookYear,
    isComplete
  };
}

function findBook(bookId) {
  for (bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (index in books) {
    if (books[index].id === bookId) {
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
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);

  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
  const title = document.createElement("h4");
  title.innerText = bookObject.bookTitle;

  const author = document.createElement("p");
  author.innerText = "Penulis: ";

  const authorName = document.createElement("span");
  authorName.classList.add("author_name");
  authorName.innerText = bookObject.bookAuthor;

  author.append(authorName);

  const year = document.createElement("p");
  year.innerText = "Tahun: ";

  const inputYear = document.createElement("span");
  inputYear.classList.add("inputYear");
  inputYear.innerText = bookObject.bookYear;

  year.append(inputYear);

  const textBookShelf = document.createElement("div");
  textBookShelf.classList.add("inner");
  textBookShelf.append(title, author, year);

  const bookShelf = document.createElement("article");
  bookShelf.classList.add("book_item");
  bookShelf.append(textBookShelf);
  bookShelf.setAttribute("id", `todo-${bookObject.id}`);

  if (bookObject.isComplete) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("green");
    undoButton.innerText = "Belum selesai";
    undoButton.addEventListener("click", function() {
      undoTaskFromCompleted(bookObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("red");
    trashButton.innerText = "Hapus buku";
    trashButton.addEventListener("click", function() {
      const proceed = confirm("Apakah Anda yakin hapus buku?");

      if (proceed) {
        removeTaskFromCompleted(bookObject.id);
      }
    });

    bookShelf.append(undoButton, trashButton);
  } else {
    const finishButton = document.createElement("button");
    finishButton.classList.add("green");
    finishButton.innerText = "Selesai dibaca";
    finishButton.addEventListener("click", function() {
      finishTaskToCompleted(bookObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("red");
    trashButton.innerText = "Hapus buku";
    trashButton.addEventListener("click", function() {
      const proceed = confirm("Apakah Anda yakin hapus buku?");

      if (proceed) {
        removeTaskFromCompleted(bookObject.id);
      }
    });

    bookShelf.append(finishButton, trashButton);
  }
  return bookShelf;
}

function addBook() {
  const bookTitle = document.getElementById("bookTittle").value;
  const bookAuthor = document.getElementById("bookAuthor").value;
  const bookYear = document.getElementById("bookYear").value;
  const isComplete = document.getElementById("isComplete").checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    bookTitle,
    bookAuthor,
    bookYear,
    isComplete
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function finishTaskToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeTaskFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;
  books.splice(bookTarget, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener("DOMContentLoaded", function() {
  const submitForm = document.getElementById("form");

  submitForm.addEventListener("submit", function() {
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, function() {
  console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener(RENDER_EVENT, function() {
  const uncompletedBookList = document.getElementById("books");
  uncompletedBookList.innerHTML = "";

  const completeBookList = document.getElementById("completeBooks");
  completeBookList.innerHTML = "";

  for (bookItem of books) {
    const bookElement = makeBook(bookItem);

    if (bookItem.isComplete == false) {
      uncompletedBookList.append(bookElement);
    } else {
      completeBookList.append(bookElement);
    }
  }
});

const searchButton = document.getElementById("searchSubmit");

searchButton.addEventListener("click", function(event) {
  const searchBookTitle = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();

  const searchTitle = document.querySelectorAll("article");

  for (book of searchTitle) {
    const searchBook = book.childNodes[0].innerText.toLowerCase();

    if (searchBook.includes(searchBookTitle)) {
      book.style.display = "block";
    } else {
      book.style.display = "none";
    }
  }
  event.preventDefault();
});
