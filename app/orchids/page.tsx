"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { uploadBookServerActionTreasures } from "./actions";

export default function DashboardPage() {
	const [books, setBooks] = useState<any[]>([]);
	const [message, setMessage] = useState<Message | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalBooks, setTotalBooks] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const booksPerPage = 50;

	// Fetch books on mount or page change
	const fetchBooks = async () => {
		setIsLoading(true);
		try {
			const supabase = createClient();

			// Get total count first
			const countQuery = await supabase
				.from("prologue_audio")
				.select("id", { count: "exact" });

			if (countQuery.error) throw countQuery.error;
			setTotalBooks(countQuery.count || 0);

			// Fetch paginated data
			const { data, error } = await supabase
				.from("prologue_audio")
				.select("id, name, path, language, created_at")
				.range((currentPage - 1) * booksPerPage, currentPage * booksPerPage - 1)
				.order("created_at", { ascending: false });

			if (error) throw error;
			setBooks(data || []);
		} catch (error) {
			console.error("Error fetching audio:", error);
			setMessage({
				error: "Failed to load audio files. Please try again.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Call fetchBooks when component mounts or page changes
	// useEffect(() => {
	//   fetchBooks();
	// }, [currentPage]);

	const uploadBook = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const fileInput = form.querySelector(
			'input[type="file"]',
		) as HTMLInputElement;
		const files = fileInput.files;

		if (!files || files.length === 0) {
			setMessage({ error: "Please select a file to upload" });
			return;
		}

		try {
			const supabase = createClient();

			for (const file of files) {
				// Upload file to storage
				await uploadBookServerActionTreasures({
					file,
					bookName: file.name,
					metadata: {
						name: file.name,
					},
				});
			}

			setMessage({ message: "Files uploaded successfully" });
			setIsModalOpen(false);
			fetchBooks(); // Refresh the list
		} catch (error) {
			console.error("Upload error:", error);
			setMessage({ error: "Upload failed. Please try again." });
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
										<th className="text-left p-2">Name</th>
										<th className="text-left p-2">Language</th>
										<th className="text-left p-2">Upload Date</th>
										<th className="text-left p-2">Actions</th>
									</tr>
								</thead>
								<tbody>
									{books.length > 0 ? (
										books.map((audio) => (
											<tr
												key={audio.id}
												className="border-b hover:bg-foreground/5"
											>
												<td className="p-2">{audio.name || "Untitled"}</td>
												<td className="p-2 capitalize">
													{audio.language || "N/A"}
												</td>
												<td className="p-2">
													{new Date(audio.created_at).toLocaleDateString()}
												</td>
											</tr>
										))
									) : (
										<tr>
											<td
												colSpan={4}
												className="text-center p-4 text-muted-foreground"
											>
												No audio files found
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
											),
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
