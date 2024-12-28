document.addEventListener("DOMContentLoaded", () => {
  const bookForm = document.getElementById("bookForm");
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");
  const searchBook = document.getElementById("searchBook");
  const searchInput = document.getElementById("searchBookTitle");
  const editBookPopup = document.getElementById("editBookPopup");
  const closePopup = document.getElementById("closePopup");
  const editBookForm = document.getElementById("editBookForm");
  let books = JSON.parse(localStorage.getItem("books")) || [];

  let editingBookId = null;

  const saveBooksToLocalStorage = () => {
    localStorage.setItem("books", JSON.stringify(books));
  };

  const addBook = (book) => {
    books.push(book);
    saveBooksToLocalStorage();
    renderBooks();
  };

  const toggleBookStatus = (bookId) => {
    const book = books.find((b) => b.id === bookId);
    if (book) {
      book.isComplete = !book.isComplete;
      saveBooksToLocalStorage();
      renderBooks();
    }
  };

  const deleteBook = (bookId) => {
    books = books.filter((book) => book.id !== bookId);
    saveBooksToLocalStorage();
    renderBooks();
  };

  const editBook = (bookId) => {
    const book = books.find((b) => b.id === bookId);
    if (book) {
      document.getElementById("editBookTitle").value = book.title;
      document.getElementById("editBookAuthor").value = book.author;
      document.getElementById("editBookYear").value = book.year;
      document.getElementById("editBookIsComplete").checked = book.isComplete;
      editingBookId = bookId;
      editBookPopup.style.display = "flex";
    }
  };

  const updateBook = (bookId, updatedBook) => {
    const bookIndex = books.findIndex((book) => book.id === bookId);
    if (bookIndex !== -1) {
      books[bookIndex] = { ...books[bookIndex], ...updatedBook };
      saveBooksToLocalStorage();
      renderBooks();
    }
  };

  const renderBooks = (filter = "") => {
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    books
      .filter((book) => book.title.toLowerCase().includes(filter.toLowerCase()))
      .forEach((book) => {
        const bookItem = document.createElement("div");
        bookItem.setAttribute("data-bookid", book.id);
        bookItem.setAttribute("data-testid", "bookItem");

        const bookTitle = document.createElement("h3");
        bookTitle.textContent = book.title;
        bookTitle.setAttribute("data-testid", "bookItemTitle");

        const bookAuthor = document.createElement("p");
        bookAuthor.textContent = `Penulis: ${book.author}`;
        bookAuthor.setAttribute("data-testid", "bookItemAuthor");

        const bookYear = document.createElement("p");
        bookYear.textContent = `Tahun: ${book.year}`;
        bookYear.setAttribute("data-testid", "bookItemYear");

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");

        const statusLabel = document.createElement("button");
        statusLabel.textContent = book.isComplete
          ? "Selesai dibaca"
          : "Belum selesai dibaca";
        statusLabel.style.padding = "2px 5px";
        statusLabel.style.backgroundColor = book.isComplete
          ? "#28a745"
          : "#ebe834";
        statusLabel.style.color = "white";
        statusLabel.style.borderRadius = "4px";
        statusLabel.style.display = "inline-block";
        statusLabel.setAttribute("data-testid", "bookItemIsCompleteButton");
        statusLabel.onclick = () => toggleBookStatus(book.id);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Hapus Buku";
        deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
        deleteButton.onclick = () => deleteBook(book.id);

        const editButton = document.createElement("button");
        editButton.textContent = "Edit Buku";
        editButton.setAttribute("data-testid", "bookItemEditButton");
        editButton.onclick = () => editBook(book.id);

        buttonContainer.append(statusLabel, deleteButton, editButton);

        bookItem.append(bookTitle, bookAuthor, bookYear, buttonContainer);

        if (book.isComplete) {
          completeBookList.appendChild(bookItem);
        } else {
          incompleteBookList.appendChild(bookItem);
        }
      });
  };

  bookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = parseInt(document.getElementById("bookFormYear").value, 10);
    const isComplete = document.getElementById("bookFormIsComplete").checked;
    const id = new Date().getTime();

    const newBook = { id, title, author, year, isComplete };
    addBook(newBook);

    bookForm.reset();
  });

  searchBook.addEventListener("submit", (e) => {
    e.preventDefault();
    const filter = searchInput.value;
    renderBooks(filter);
  });

  closePopup.addEventListener("click", () => {
    editBookPopup.style.display = "none";
  });

  editBookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const updatedBook = {
      title: document.getElementById("editBookTitle").value,
      author: document.getElementById("editBookAuthor").value,
      year: document.getElementById("editBookYear").value,
      isComplete: document.getElementById("editBookIsComplete").checked,
    };

    updateBook(editingBookId, updatedBook);
    editBookPopup.style.display = "none";
  });

  renderBooks();
});
