"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import {
  updateBooks,
  uploadBookServerAction,
  uploadBookServerActionDe,
  uploadTreasureServerAction,
} from "./actions"; // Assuming this path is correct
import {
  updateBookCollectionServerAction,
  deleteBookServerAction,
} from "./actions"; // Import server actions
import ePub from "epubjs";

export default function DashboardPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [message, setMessage] = useState<Message | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const booksPerPage = 50;
  const [editingBookId, setEditingBookId] = useState<string | null>(null); // State to track which book is being edited
  const [collectionNameInput, setCollectionNameInput] = useState<string>(""); // State for input value

  // Fetch books on mount or page change
  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();

      // Get total count first with a separate query
      const countQuery = await supabase
        .from("library_books")
        .select("id", { count: "exact" });

      if (countQuery.error) {
        throw countQuery.error;
      }

      setTotalBooks(countQuery.count || 0);

      // Get paginated data
      const { data, error } = await supabase
        .from("library_books")
        .select("*")
        .order("created_at", { ascending: false })
        .range(
          (currentPage - 1) * booksPerPage,
          currentPage * booksPerPage - 1
        );

      if (error) {
        throw error;
      }

      setBooks(data || []);
    } catch (error) {
      console.error("Error fetching books:", error);
      setMessage({
        error: "Failed to load books. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Call fetchBooks when component mounts or page changes
  useEffect(() => {
    fetchBooks();
  }, [currentPage]);

  // Function to extract EPUB metadata (remains the same)
  const extractEpubMetadata = async (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const book = ePub(arrayBuffer);
          await book.ready;
          const metadata = await book.loaded.metadata;
          resolve(metadata);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  // Client-side upload handler (fixed to refresh books after upload)
  const uploadBook = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const files = formData.getAll("file") as File[];
    const fileType = formData.get("file_type") as "ebook" | "audiobook";

    if (!files || files.length === 0 || !fileType) {
      setMessage({ error: "Please select at least one file" });
      return;
    }

    try {
      const uploadedBooks = [];

      for (const file of files) {
        // Improved file name parsing with fallbacks
        let bookName = file.name;
        let bookId = "";
        // for book format.
        const fileNameMatch = file.name.match(/(.*) \[(.*)\]\.[^/.]+$/);
        if (fileNameMatch) {
          bookName = fileNameMatch[1];
          bookId = fileNameMatch[2];
        }

        let metadata: any = {
          title: bookName,
          book_id: bookId,
        };

        // Extract EPUB metadata if applicable
        if (fileType === "ebook" && file.name.toLowerCase().endsWith(".epub")) {
          try {
            const epubMetadata = await extractEpubMetadata(file);
            metadata = {
              ...epubMetadata,
              ...metadata,
            };
          } catch (e) {
            console.error("Error extracting EPUB metadata:", e);
          }
        }

        const result =
          metadata?.language === "en"
            ? await uploadBookServerAction({
                file,
                fileType,
                bookName,
                bookId,
                metadata,
              })
            : await uploadBookServerActionDe({
                file,
                fileType,
                bookName,
                bookId,
                metadata,
              });

        if (!result.success) {
          setMessage({
            error: `Failed to upload "${bookName}": ${result.error}`,
          });
          continue;
        }

        uploadedBooks.push(bookName);
      }

      if (uploadedBooks.length > 0) {
        // Set success message
        setMessage({
          success: `Successfully uploaded ${uploadedBooks.length} book(s)`,
        });

        // Reset to first page and refresh the book list
        setCurrentPage(1);
        await fetchBooks(); // Call fetchBooks to refresh the list
        // Close the modal after successful upload
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error uploading book:", error);
      setMessage({
        error: "An unexpected error occurred while uploading",
      });
    }
  };

  // Function to handle editing a book's collection
  const handleEditCollection = (bookId: string) => {
    setEditingBookId(bookId);
    const bookToEdit = books.find((book) => book.id === bookId);
    setCollectionNameInput(bookToEdit?.collection_name || ""); // Initialize input with current value
  };

  const handleSaveCollection = async (bookId: string) => {
    setIsLoading(true); // Optionally show loading state during save
    setMessage(null); // Clear any previous messages

    const collectionName = collectionNameInput;

    const result = await updateBookCollectionServerAction(
      bookId,
      collectionName
    );

    if (result && result.success) {
      setMessage({
        success: "Collection updated successfully",
      });
      setEditingBookId(null); // Exit edit mode
      setCollectionNameInput(""); // Clear input field
      await fetchBooks(); // Refresh books list after update
    } else {
      setMessage({
        error: `Failed to update collection: ${result?.error || "Unknown error"}`,
      });
    }
    setIsLoading(false);
  };

  const handleCancelEdit = () => {
    setEditingBookId(null);
    setCollectionNameInput(""); // Clear input field
  };

  const handleCollectionNameInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCollectionNameInput(e.target.value);
  };

  // Function to handle deleting a book
  const handleDeleteBook = async (bookId: string, bookTitle: string) => {
    setMessage(null); // Clear previous messages

    if (
      window.confirm(
        `Are you sure you want to delete "${bookTitle}"? This action cannot be undone.`
      )
    ) {
      setIsLoading(true); // Show loading state
      try {
        const result = await deleteBookServerAction(bookId);

        if (result && result.success) {
          setMessage({ success: `Successfully deleted "${bookTitle}".` });
          // Refresh the book list
          // If deleting the last item on a page beyond the first, go to the previous page
          if (books.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1); // This will trigger fetchBooks via useEffect
          } else {
            await fetchBooks(); // Fetch books for the current page
          }
        } else {
          setMessage({
            error: `Failed to delete book: ${result?.error || "Unknown error"}`,
          });
        }
      } catch (error) {
        console.error("Error deleting book:", error);
        setMessage({
          error: "An unexpected error occurred while deleting the book.",
        });
      } finally {
        setIsLoading(false); // Hide loading state
      }
    }
  };

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalBooks / booksPerPage);
  const showingFrom =
    totalBooks === 0 ? 0 : (currentPage - 1) * booksPerPage + 1;
  const showingTo = Math.min(currentPage * booksPerPage, totalBooks);

  // Function to handle page navigation
  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Number of page buttons to show at once

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Add first page
    if (startPage > 1) {
      pageNumbers.push(1);
      // Add ellipsis if needed
      if (startPage > 2) {
        pageNumbers.push("...");
      }
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Add last page
    if (endPage < totalPages) {
      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  // Close modal if clicked outside of content
  const handleModalBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto p-4">
      <button
        onClick={async () => {
          const data = await fetch("/data.json");
          const dataParsed = await data.json();
          updateBooks(dataParsed.data);
          console.log("success");
        }}
      >
        Update books
      </button>
      {/* Header and upload button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Library Books</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          Upload Book
        </button>
      </div>

      {/* Show message if present */}
      {message && <FormMessage message={message} />}

      <div className="bg-foreground/5 p-6 rounded-lg">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <p>Loading books...</p>
            </div>
          ) : (
            <>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Title</th>
                    <th className="text-left p-2">Type</th>
                    <th className="text-left p-2">BookId</th>
                    <th className="text-left p-2">Collection</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.length > 0 ? (
                    books.map((book) => (
                      <tr
                        key={book.id}
                        className="border-b hover:bg-foreground/5"
                      >
                        <td className="p-2">
                          {book.metadata?.title || "Untitled"}
                        </td>
                        <td className="p-2 capitalize">{book.file_type}</td>
                        <td className="p-2">{book?.book_id || "N/A"}</td>
                        <td className="p-2">
                          {editingBookId === book.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={collectionNameInput}
                                onChange={handleCollectionNameInputChange}
                                className="bg-background border rounded-md p-1 text-sm"
                                placeholder="Collection Name"
                              />
                              <button
                                onClick={() => handleSaveCollection(book.id)}
                                className="text-black"
                                aria-label="Save"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="black"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="text-black"
                                aria-label="Cancel"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="black"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <line x1="18" y1="6" x2="6" y2="18" />
                                  <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <span>{book.collection_name || "N/A"}</span>
                          )}
                        </td>
                        <td className="p-2">
                          {editingBookId === book.id ? (
                            <div className="flex items-center gap-2 h-[16px]"></div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditCollection(book.id)}
                                className="text-black"
                                aria-label="Edit Collection"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                                </svg>
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteBook(
                                    book.id,
                                    book.metadata?.title || "Untitled"
                                  )
                                }
                                className="text-red-600 hover:text-red-800"
                                aria-label="Delete Book"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-trash-2"
                                >
                                  <path d="M3 6h18" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                  <line x1="10" x2="10" y1="11" y2="17" />
                                  <line x1="14" x2="14" y1="11" y2="17" />
                                </svg>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center p-4 text-muted-foreground"
                      >
                        No books found in the library
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination Controls */}
              {totalBooks > 0 && (
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {showingFrom} to {showingTo} of {totalBooks} books
                  </div>
                  <div className="flex gap-1 items-center">
                    <button
                      onClick={() => changePage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-md hover:bg-foreground/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Previous page"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>
                    {getPageNumbers().map((page, index) =>
                      typeof page === "number" ? (
                        <button
                          key={index}
                          onClick={() => changePage(page)}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === page
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-foreground/10"
                          }`}
                        >
                          {page}
                        </button>
                      ) : (
                        <span key={index} className="px-2">
                          {page}
                        </span>
                      )
                    )}
                    <button
                      onClick={() => changePage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-md hover:bg-foreground/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Next page"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={handleModalBackdropClick}
        >
          <div className="bg-background p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Upload Book</h2>
            <form onSubmit={uploadBook} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm mb-1">File Type</label>
                <select
                  name="file_type"
                  className="w-full p-2 border rounded-md"
                  defaultValue="ebook"
                >
                  <option value="ebook">E-Book</option>
                  <option value="audiobook">Audiobook</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Select Files</label>
                <input
                  type="file"
                  name="file"
                  multiple
                  className="w-full p-2 border rounded-md"
                  accept=".epub,.pdf,.mp3,.m4a,.m4b"
                />
                <p className="text-xs mt-1 text-muted-foreground">
                  Supported formats: EPUB, PDF, MP3, M4A, M4B
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Note: Book metadata will be extracted from EPUB files.
                </p>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <SubmitButton>Upload</SubmitButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
