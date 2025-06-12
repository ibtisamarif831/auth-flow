"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import OtpVerification from "@/app/signup/otp";
import { verifyOtpAndResetPassword } from "./actions";

function VerifyOtpPage() {
	const searchParams = useSearchParams();
	const email = searchParams.get("email");
	const [password, setPassword] = useState("");

	const handleVerify = async (otp: string) => {
		if (email) {
			await verifyOtpAndResetPassword({ email, otp, password });
		}
	};

	const handleResend = async () => {
		// Implement resend logic if needed
	};

	if (!email) {
		return <div>Email not found.</div>;
	}

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<OtpVerification
				email={email}
				onVerify={handleVerify}
				onResend={handleResend}
				onBack={() => window.history.back()}
				isVerifying={false}
				error={null}
			>
				<div className="mt-4">
					<label
						htmlFor="password"
						className="block text-gray-300 text-sm font-medium mb-1"
					>
						New Password
					</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full bg-gray-800 text-white py-3 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
						placeholder="••••••••"
						required
					/>
				</div>
			</OtpVerification>
		</Suspense>
	);
}

export default function VerifyOtp() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<VerifyOtpPage />
		</Suspense>
	);
}
