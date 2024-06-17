import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/components/Loading";

const BookList = ({
  books,
  fetchBooks,
  setEditSuccess,
  setDeleteSuccess,
  setLoadingSave,
  csrfToken
}) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "UTC",
    });
  };

  //Method 1: Local
  // const [bookDataLocal, setBookDataLocal] = useState({
  //   title: "",
  //   author: "",
  //   publishYear: "",
  //   createdAt: "",
  //   updatedAt: "",
  // });

  // const showBookDataLocal = (book) => {
  //   setBookDataLocal({
  //     title: book.title,
  //     author: book.author,
  //     publishYear: book.publishYear,
  //     createdAt: formatDate(book.createdAt),
  //     updatedAt: formatDate(book.updatedAt),
  //   });
  //   document.getElementById("show_book_modal").showModal();
  // };

  //Method 2: API
  const [book, setBook] = useState({});
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const showBookDataAPI = (id, modal_name) => {
    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/books/${id}`)
      .then((res) => {
        setBook(res.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        console.log(error);
        setLoading(false);
      });
    document.getElementById(modal_name).showModal();
  };

  const [editError, setEditError] = useState(false);
  const [editErrorMessage, setEditErrorMessage] = useState("false");
  const [deleteError, setDeleteError] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("false");

  const handleEditBook = async () => {
    setLoadingSave(true);
    const data = {
      title: book.title,
      author: book.author,
      publishYear: book.publishYear,
    };
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/books/${book._id}`,
        data,
        {
          headers: {
            "csrf-token": csrfToken,
          },
          withCredentials: true,
        }
      );
      setEditSuccess(true);
      fetchBooks();
    } catch (error) {
      setEditError(true);
      setEditErrorMessage(
        error.response.data.message ||
          "An error occurred while Editing the book."
      ); // Provide default error message
      console.error("Error Editing book:", error.response.data.message);
    } finally {
      setLoadingSave(false); // Ensure loading state is reset even on errors
      // Clear success/error states after 3 seconds
      setTimeout(() => {
        setEditSuccess(false);
        setEditError(false);
      }, 3000);
    }
  };

  const handleDeleteBook = async () => {
    setLoadingSave(true);
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/books/${book._id}`,
        {
          headers: {
            "csrf-token": csrfToken,
          },
          withCredentials: true,
        }
      );
      setDeleteSuccess(true);
      fetchBooks();
    } catch (error) {
      setDeleteError(true);
      setDeleteErrorMessage(
        error.response.data.message ||
          "An error occurred while Deleting the book."
      ); // Provide default error message
      console.error("Error Deleting book:", error.response.data.message);
    } finally {
      setLoadingSave(false); // Ensure loading state is reset even on errors
      // Clear success/error states after 3 seconds
      setTimeout(() => {
        setDeleteSuccess(false);
        setEditError(false);
      }, 3000);
    }
  };

  return (
    <>
      {editError && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-error">
            <span>{editErrorMessage}</span>
          </div>
        </div>
      )}
      {deleteError && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-error">
            <span>{deleteErrorMessage}</span>
          </div>
        </div>
      )}
      {/* Method 1: Local
      <dialog id="show_book_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Book Details</h3>
          <p className="py-4">Title: {bookDataLocal.title}</p>
          <p className="py-4">Author: {bookDataLocal.author}</p>
          <p className="py-4">Publish Year: {bookDataLocal.publishYear}</p>
          <p className="py-4">Created Time: {bookDataLocal.createdAt}</p>
          <p className="py-4">Last Updated Time: {bookDataLocal.updatedAt}</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-error">Close</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog> */}
      {/* Method 2: API */}
      <dialog id="show_book_modal" className="modal">
        <div className="modal-box">
          {loading ? (
            <Loading />
          ) : (
            <>
              <h3 className="font-bold text-lg">Book Details</h3>
              <p className="py-4">Title: {book.title}</p>
              <p className="py-4">Author: {book.author}</p>
              <p className="py-4">Publish Year: {book.publishYear}</p>
              <p className="py-4">Created Time: {formatDate(book.createdAt)}</p>
              <p className="py-4">
                Last Updated Time: {formatDate(book.updatedAt)}
              </p>
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn btn-error">Close</button>
                </form>
              </div>
            </>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <dialog id="edit_book_modal" className="modal">
        <div className="modal-box">
          {loading ? (
            <Loading />
          ) : (
            <>
              <h3 className="font-bold text-lg">Edit Book</h3>
              <form
                method="dialog"
                id="editBookForm"
                onSubmit={() => handleEditBook()}
                className="py-4 flex flex-col gap-4"
              >
                <div>
                  <label className="text-md">Title</label>
                  <input
                    value={book.title}
                    type="text"
                    onChange={(e) =>
                      setBook({ ...book, title: e.target.value })
                    }
                    className="input input-bordered w-full"
                  ></input>
                </div>
                <div>
                  <label className="text-md">Author</label>
                  <input
                    value={book.author}
                    type="text"
                    onChange={(e) =>
                      setBook({ ...book, author: e.target.value })
                    }
                    className="input input-bordered w-full"
                  ></input>
                </div>
                <div>
                  <label className="text-md">Publish Year</label>
                  <input
                    value={book.publishYear}
                    type="text"
                    onChange={(e) =>
                      setBook({ ...book, publishYear: e.target.value })
                    }
                    className="input input-bordered w-full"
                  ></input>
                </div>
              </form>
              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn btn-error">Close</button>
                </form>
                <button form="editBookForm" className="btn btn-success">
                  Edit Book
                </button>
              </div>
            </>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <dialog id="show_delete_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete Book</h3>
          <p className="py-4 text-xl">
            Are you sure you want to delete the book
          </p>
          <p className="text-2xl font-bold"> {book.title}</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-error">Close</button>
            </form>
            <form method="dialog">
              <button
                className="btn btn-success"
                onClick={() => handleDeleteBook()}
              >
                Delete Book
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <div>
        <table className="w-full border-separate border-spacing-2">
          <thead>
            <tr>
              <th className="shadow-neutral shadow-sm bg-base-300 rounded-md text-xl py-4">
                No
              </th>
              <th className="shadow-neutral shadow-sm bg-base-300 rounded-md text-xl py-4">
                Title
              </th>
              <th className="shadow-neutral shadow-sm bg-base-300 rounded-md text-xl py-4">
                Author
              </th>
              <th className="shadow-neutral shadow-sm bg-base-300 rounded-md text-xl py-4">
                Publish Year
              </th>
              <th className="shadow-neutral shadow-sm bg-base-300 rounded-md text-xl py-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-center">
            {books.map((book, index) => (
              <tr key={book._id}>
                <td className="shadow-neutral shadow-sm bg-base-300 rounded-md">
                  {index + 1}
                </td>
                <td className="shadow-neutral shadow-sm bg-base-300 rounded-md">
                  {book.title}
                </td>
                <td className="shadow-neutral shadow-sm bg-base-300 rounded-md">
                  {book.author}
                </td>
                <td className="shadow-neutral shadow-sm bg-base-300 rounded-md">
                  {book.publishYear}
                </td>
                <td className="shadow-neutral shadow-sm bg-base-300 rounded-md w-72">
                  <div className="flex justify-center gap-4 p-2">
                    {/* Method 1: Local
                    <button
                      className="btn btn-info w-28"
                      onClick={() => showBookDataLocal(book)}
                    >
                      View
                    </button> */}
                    {/* Method 2: API */}
                    <button
                      className="btn btn-info w-28"
                      onClick={() =>
                        showBookDataAPI(book._id, "show_book_modal")
                      }
                    >
                      View
                    </button>
                    <button
                      className="btn btn-warning w-28"
                      onClick={() =>
                        showBookDataAPI(book._id, "edit_book_modal")
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-error w-28"
                      onClick={() =>
                        showBookDataAPI(book._id, "show_delete_modal")
                      }
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BookList;
