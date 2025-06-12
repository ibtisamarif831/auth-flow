"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function verifyOtpAndResetPassword({
	email,
	otp,
	password,
}: {
	email: string;
	otp: string;
	password?: string;
}) {
	if (!password) {
		return { error: "Password is required" };
	}
	console.log("Verifying OTP for email:", email);
	const supabase = await createClient();
	const { error: otpError } = await supabase.auth.verifyOtp({
		email,
		token: otp,
		type: "recovery",
	});

	if (otpError) {
		console.error("Error verifying OTP:", otpError);
		redirect(
			`/verify-otp?email=${encodeURIComponent(email)}&error=Invalid OTP`,
		);
	}

	const { error: passwordError } = await supabase.auth.updateUser({
		password,
	});

	if (passwordError) {
		console.error("Error updating password:", passwordError);
		return { error: "Could not update password" };
	}

	redirect("/signin?message=Password updated successfully");
}
