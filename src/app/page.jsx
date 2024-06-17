"use client";
import Loading from "@/components/Loading";
import axios from "axios";
import React, { useEffect, useState } from "react";
import BookList from "./BookList";
import Layout from "./BookLayout";

const BooksHome = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBooks = () => {
    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/books`)
      .then((res) => {
        setBooks(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // useEffect(() => {
  //   console.log(books);
  // }, [books]);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publishYear, setPublishYear] = useState("");
  const [loadingSave, setLoadingSave] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState("false");
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    // Fetch the CSRF token from the server
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/csrf-token`, {
        withCredentials: true,
      })
      .then((response) => {
        setCsrfToken(response.data.csrfToken);
      })
      .catch((error) => {
        console.error("Error fetching CSRF token:", error);
      });
  }, []);

  const handleSaveBook = async () => {
    // e.preventDefault();
    setLoadingSave(true);
    const data = {
      title,
      author,
      publishYear,
    };
    setTitle("");
    setAuthor("");
    setPublishYear("");
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/books`,
        data,
        {
          headers: {
            "csrf-token": csrfToken,
          },
          withCredentials: true,
        }
      );
      setBooks(response.data.data);
      setSaveSuccess(true);
      fetchBooks();
    } catch (error) {
      setSaveError(true);
      setSaveErrorMessage(
        error.response.data.message ||
          "An error occurred while saving the book."
      ); // Provide default error message
      console.error("Error saving book:", error.response.data.message);
    } finally {
      setLoadingSave(false); // Ensure loading state is reset even on errors
      // Clear success/error states after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
        setSaveError(false);
      }, 3000);
    }
  };

  return (
    <Layout>
      {loadingSave && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-warning">
            <span>Saving Book...</span>
            <Loading />
          </div>
        </div>
      )}
      {saveSuccess && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Book Saved Successfully</span>
          </div>
        </div>
      )}
      {saveError && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-error">
            <span>{saveErrorMessage}</span>
          </div>
        </div>
      )}
      {editSuccess && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Book Edited Successfully</span>
          </div>
        </div>
      )}
      {deleteSuccess && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Book Deleted Successfully</span>
          </div>
        </div>
      )}
      <div className="flex text-2xl items-center justify-between">
        <h1 className="">Book List</h1>
        <button
          className="btn btn-primary p-2"
          onClick={() => document.getElementById("add_book_modal").showModal()}
        >
          Add Book
        </button>
        <dialog id="add_book_modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Add Book</h3>
            <form
              method="dialog"
              id="addBookForm"
              onSubmit={() => handleSaveBook()}
              className="py-4 flex flex-col gap-4"
            >
              <div>
                <label className="text-md">Title</label>
                <input
                  value={title}
                  type="text"
                  onChange={(e) => setTitle(e.target.value)}
                  className="input input-bordered w-full"
                ></input>
              </div>
              <div>
                <label className="text-md">Author</label>
                <input
                  value={author}
                  type="text"
                  onChange={(e) => setAuthor(e.target.value)}
                  className="input input-bordered w-full"
                ></input>
              </div>
              <div>
                <label className="text-md">Publish Year</label>
                <input
                  value={publishYear}
                  type="text"
                  onChange={(e) => setPublishYear(e.target.value)}
                  className="input input-bordered w-full"
                ></input>
              </div>
            </form>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-error">Close</button>
              </form>
              <button form="addBookForm" className="btn btn-success">
                Add Book
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <BookList
          books={books}
          fetchBooks={fetchBooks}
          setEditSuccess={setEditSuccess}
          setDeleteSuccess={setDeleteSuccess}
          setLoadingSave={setLoadingSave}
          csrfToken={csrfToken}
        />
      )}
    </Layout>
  );
};

export default BooksHome;
