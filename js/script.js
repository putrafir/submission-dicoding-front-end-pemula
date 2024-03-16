const books = [];
const StorageKey = "BOOK-SHELF";
const RENDER_EVENT = "render-books";
const SAVED_EVENT = "saved-books";

function generated() {
  return +new Date();
}

function generateBookObject(id, judul, author, tahun, isComplete) {
  return {
    id,
    judul,
    author,
    tahun,
    isComplete,
  };
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id == bookId) {
      return bookItem;
    }
  }
  return null;
}

function isStorageExist() {
  if (typeof Storage == undefined) {
    alert("Browser kamu tidak mendukung web storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(StorageKey, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(StorageKey);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
  const { id, judul, author, tahun, isComplete } = bookObject;

  const teksJudul = document.createElement("h2");
  teksJudul.innerText = judul;

  const isiPenulis = document.createElement("h5");
  isiPenulis.innerText = `Penulis: ${author}`;

  const isiTahun = document.createElement("h5");
  isiTahun.innerText = `Tahun: ${tahun}`;

  const isiContainer = document.createElement("div");
  isiContainer.classList.add("isi-container");
  isiContainer.append(isiPenulis, isiTahun);

  const div = document.createElement("div");
  div.append(teksJudul, isiContainer);

  const inner = document.createElement("div");
  inner.classList.add("inner");
  inner.append(div);

  const container = document.createElement("div");
  container.classList.add("book-container");
  container.append(inner);

  const headContainer = document.createElement("div");
  headContainer.classList.add("head-container");
  headContainer.append(container);

  if (isComplete) {
    const belumButton = document.createElement("button");
    belumButton.innerText = "Belum";
    belumButton.classList.add("belum-button");

    const hapusButton = document.createElement("button");
    hapusButton.innerText = "Hapus";
    hapusButton.classList.add("hapus-button");

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");
    buttonContainer.append(belumButton, hapusButton);

    belumButton.addEventListener("click", function () {
      kembalikanKeBelum(id);
    });

    hapusButton.addEventListener("click", function () {
      removeBook(id);
    });

    inner.append(buttonContainer);
  } else {
    const sudahButton = document.createElement("button");
    sudahButton.innerText = "Selesai";
    sudahButton.classList.add("sudah-button");

    const hapusButton = document.createElement("button");
    hapusButton.innerText = "Hapus";
    hapusButton.classList.add("hapus-button");

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");
    buttonContainer.append(sudahButton, hapusButton);

    sudahButton.addEventListener("click", function () {
      keSudahDibaca(id);
    });

    hapusButton.addEventListener("click", function () {
      removeBook(id);
    });

    inner.append(buttonContainer);
  }

  return headContainer;
}

function keSudahDibaca(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget == -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function kembalikanKeBelum(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBook() {
  const teksJudulBook = document.getElementById("inputBookTitle").value;
  const teksAuthorBook = document.getElementById("inputBookAuthor").value;
  const teksTahunBook = document.getElementById("inputBookYear").value;

  const generatedId = generated();
  const bookObject = generateBookObject(
    generatedId,
    teksJudulBook,
    teksAuthorBook,
    teksTahunBook,
    false
  );

  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log("data berhasil di simpan");
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById("books");
  const listCompleted = document.getElementById("completed-books");

  uncompletedBookList.innerHTML = "";
  listCompleted.innerHTML = "";
  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isComplete) {
      listCompleted.append(bookElement);
    } else {
      uncompletedBookList.append(bookElement);
    }
  }
});
