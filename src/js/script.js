const book = [];
const StorageKey = "BOOK-SHELF";

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

function isStorageExist() {
  if (typeof Storage == undefined) {
    alert("Browser kamu tidak mendukung web storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(book);
    localStorage.setItem(StorageKey, parsed);
  }
}
