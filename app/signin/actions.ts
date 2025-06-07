"use server";

import { createClient } from "@/utils/supabase/server";

export const signinUser = async ({
	email,
	password,
}: {
	email: string;
	password: string;
}) => {
	const supabase = await createClient();
	const response = await supabase.auth.signInWithPassword({
		email,
		password,
	});
	if (response.error) {
		// Handle error during signin
		return { success: false, message: response.error.message };
	}
	console.log("User signed in successfully:", response.data);

	// Simulate a successful signin response
	return { success: true, message: "User signed in successfully!" };
};
