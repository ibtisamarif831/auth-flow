"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function requestPasswordReset(formData: FormData) {
	const email = formData.get("email") as string;

	if (!email) {
		console.error("Email is required");
		return;
	}

	const supabase = await createClient();
	const { error } = await supabase.auth.resetPasswordForEmail(email);

	if (error) {
		console.error("Error sending password reset email:", error);
		return;
	}

	redirect(
		`/verify-otp?email=${encodeURIComponent(
			email,
		)}&message=OTP has been sent to your email`,
	);
}
