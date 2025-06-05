"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/utils/supabase/admin";

function sanitizeBookName(bookName: string) {
	return bookName
		.replace(/ /g, "_") // Replace spaces with underscores
		.replace(/[^a-zA-Z0-9_\-/]/g, "") // Remove illegal characters
		.replace(/\/+/g, "/") // Remove duplicate slashes
		.replace(/^\/|\/$/g, ""); // Remove leading/trailing slashes
}
export async function uploadBookServerAction(bookData: {
	file: File;
	fileType: "ebook" | "audiobook";
	bookName: string;
	bookId: string;
	metadata: any;
}) {
	"use server";
	const supabase = await createAdminClient();

	try {
		const { data: uploadData, error: uploadError } = await supabase.storage
			.from("library")
			.upload(
				`${bookData.fileType}s/books_en/${Date.now()}_${sanitizeBookName(bookData.bookName)}`,
				bookData.file,
				{ upsert: true },
			);

		if (uploadError) {
			throw uploadError;
		}
		const { error } = await supabase.from("library_books").insert({
			file_path: uploadData?.path as string,
			file_type: bookData.fileType,
			metadata_en: bookData.metadata,
			book_id: bookData.bookId,
			price: 0,
		});

		if (error) throw error;

		return { success: true };
	} catch (error) {
		console.error("Server-side error uploading book:", error);
		return { success: false, error: (error as Error).message };
	}
}
export async function uploadBookServerActionDe(bookData: {
	file: File;
	fileType: "ebook" | "audiobook";
	bookName: string;
	bookId: string;
	metadata: any;
}) {
	"use server";
	const supabase = await createAdminClient();

	try {
		const { data: uploadData, error: uploadError } = await supabase.storage
			.from("library")
			.upload(
				`${bookData.fileType}s/books_de/${Date.now()}_${sanitizeBookName(bookData.bookName)}`,
				bookData.file,
				{ upsert: true },
			);

		if (uploadError) {
			throw uploadError;
		}
		const { error } = await supabase
			.from("library_books")
			.update({
				file_path_de: uploadData?.path as string,
				metadata_de: bookData.metadata,
				price: 0,
			})
			.eq("book_id", bookData.bookId);

		if (error) throw error;

		return { success: true };
	} catch (error) {
		console.error("Server-side error uploading book:", error);
		return { success: false, error: (error as Error).message };
	}
}
export async function uploadTreasureServerAction(bookData: {
	file: File;
	fileType: "ebook" | "audiobook";
	bookName: string;
	bookId: string;
	metadata: any;
}) {
	"use server";
	const supabase = await createAdminClient();

	try {
		const { data: uploadData, error: uploadError } = await supabase.storage
			.from("library")
			.upload(
				`${bookData.fileType}s/old_treasures/${Date.now()}_${encodeURIComponent(bookData.bookName)}`,
				bookData.file,
				{ upsert: true },
			);
		const metaDataFix = {
			...bookData.metadata,
			language:
				bookData.metadata.language === "ger"
					? "de"
					: bookData.metadata.language,
		};
		if (uploadError) {
			throw uploadError;
		}
		const { error } = await supabase.from("library_books").insert({
			file_path: uploadData?.path as string,
			file_type: bookData.fileType,
			metadata: metaDataFix,
			book_id: bookData.bookId,
			price: 0,
			collection_name: "old_treasures",
		});

		if (error) throw error;

		return { success: true };
	} catch (error) {
		console.error("Server-side error uploading book:", error);
		return { success: false, error: (error as Error).message };
	}
}
export async function updateBookCollectionServerAction(
	bookId: string,
	collectionName: string,
) {
	"use server";
	const supabase = await createAdminClient();
	console.log(bookId, collectionName);
	try {
		const { data, error } = await supabase
			.from("library_books")
			.update({ collection_name: collectionName })
			.eq("id", bookId);
		if (error) {
			throw error;
		}
		console.log(data);
		return { success: true };
	} catch (error) {
		console.error("Server-side error updating book:", error);
		return { success: false, error: (error as Error).message };
	}
}

export async function deleteBookServerAction(bookId: string) {
	"use server";
	const supabase = await createAdminClient();

	try {
		// 1. Fetch the book record to get the storage path
		const { data: bookData, error: fetchError } = await supabase
			.from("library_books")
			.select("file_path")
			.eq("id", bookId)
			.single();

		if (fetchError || !bookData) {
			console.error(
				"Error fetching book for deletion or book not found:",
				fetchError,
			);
			// If the book isn't found, maybe it was already deleted.
			// We can proceed to attempt deletion from the DB anyway or return an error.
			// Let's proceed and let the DB delete handle non-existence gracefully.
			if (fetchError?.code === "PGRST116") {
				// PostgREST code for "Resource Not Found"
				console.log(
					`Book with ID ${bookId} not found, potentially already deleted.`,
				);
				// Proceed to delete just in case, DB delete won't fail if not found
			} else {
				throw fetchError || new Error("Book not found.");
			}
		}

		// 2. Delete the file from storage if path exists
		if (bookData?.file_path) {
			const { error: storageError } = await supabase.storage
				.from("library")
				.remove([bookData.file_path]);

			if (storageError) {
				// Log the error but proceed to delete the DB record
				console.error(
					`Error deleting file ${bookData.file_path} from storage:`,
					storageError,
				);
				// Depending on requirements, you might want to throw here
				// throw storageError;
			} else {
				console.log(
					`Successfully deleted file ${bookData.file_path} from storage.`,
				);
			}
		} else {
			console.warn(
				`No file_path found for book ID ${bookId}. Skipping storage deletion.`,
			);
		}

		// 3. Delete the book record from the database
		const { error: dbError } = await supabase
			.from("library_books")
			.delete()
			.match({ id: bookId });

		if (dbError) {
			throw dbError;
		}

		console.log(
			`Successfully deleted book record with ID ${bookId} from database.`,
		);
		return { success: true };
	} catch (error) {
		console.error("Server-side error deleting book:", error);
		return { success: false, error: (error as Error).message };
	}
}

export const signInAction = async (formData: FormData) => {
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;
	const supabase = await createClient();

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		return encodedRedirect("error", "/sign-in", error.message);
	}

	return redirect("/protected");
};

export async function updateBooks(data: any[]) {
	const supabase = await createAdminClient();

	for (const book of data) {
		const { book_id, ...updateFields } = book;

		const { error } = await supabase
			.from("library_books") // replace with your actual table name
			.update(updateFields)
			.eq("book_id", book_id);

		if (error) {
			console.error(`Failed to update book ${book_id}:`, error.message);
		} else {
			console.log(`Successfully updated book ${book_id}`);
		}
	}
}
