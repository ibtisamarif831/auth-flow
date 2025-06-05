

"use server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function uploadBookServerActionTreasures(bookData: {
    file: File;
    bookName: string;
    metadata: any;
}) {
    const supabase = await createAdminClient();

    try {
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("library")
            .upload(`treasures/german/${bookData.bookName}`, bookData.file, { upsert: true });

        if (uploadError) {
            throw uploadError;
        }
        const { error } = await supabase.from("treasures").insert({
            file_path: uploadData?.path as string,
            metadata: bookData.metadata,
            collection_name: "old_treasures",
            language: 'de'
        });

        if (error) throw error;

        return { success: true };
    } catch (error) {
        console.error("Server-side error uploading book:", error);
        return { success: false, error: (error as Error).message };
    }
}
