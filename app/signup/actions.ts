"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export const signupUser = async ({
	email,
	password,
}: {
	email: string;
	password: string;
}) => {
	const supabase = await createClient();
	const { data: existingUser } = await supabase
		.from("users")
		.select("*")
		.eq("email", email)
		.maybeSingle();
	if (existingUser) {
		// User already exists
		return { success: false, message: "User already exists with this email." };
	}

	const response = await supabase.auth.signUp({
		email,
		password,
	});
	if (response.error) {
		// Handle error during signup
		return { success: false, message: response.error.message };
	}
	console.log("User signed up successfully:", response.data);

	// Simulate a successful signup response
	return { success: true, message: "User signed up successfully!" };
};
const temporaryOtpStore: { [email: string]: string } = {};

// 2. Verify OTP: Checks the provided OTP and activates the user
export async function verifyOtp({
	email,
	otp,
}: { email: string; otp: string }) {
	const supabase = await createClient();
	const { error } = await supabase.auth.verifyOtp({
		email,
		token: otp,
		type: "signup",
	});
	if (error) {
		// Handle error during OTP verification
		return { success: false, error: error.message };
	}
	console.log("OTP verified successfully for:", email);
	// Simulate a successful OTP verification response
	return { success: true, message: "OTP verified successfully!" };
}

// 3. Resend OTP: Generates and sends a new OTP
export async function resendOtp({ email }: { email: string }) {
	const supabase = await createClient();
	const { error } = await supabase.auth.resend({
		type: "signup",
		email,
	});
}
