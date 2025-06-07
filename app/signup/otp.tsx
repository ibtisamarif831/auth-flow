// OtpVerification.tsx
"use client";

import {
	useState,
	useRef,
	useEffect,
	ChangeEvent,
	KeyboardEvent,
	ClipboardEvent,
} from "react";

interface OtpVerificationProps {
	email: string;
	onVerify: (otp: string) => Promise<void>;
	onResend: () => Promise<void>;
	onBack: () => void;
	isVerifying: boolean;
	error: string | null;
}

export default function OtpVerification({
	email,
	onVerify,
	onResend,
	onBack,
	isVerifying,
	error,
}: OtpVerificationProps) {
	const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
	const [resendCooldown, setResendCooldown] = useState(60);
	const inputRefs = useRef<HTMLInputElement[]>([]);

	// Effect for the resend cooldown timer
	useEffect(() => {
		if (resendCooldown > 0) {
			const timer = setTimeout(
				() => setResendCooldown(resendCooldown - 1),
				1000,
			);
			return () => clearTimeout(timer);
		}
	}, [resendCooldown]);

	const handleResendClick = async () => {
		if (resendCooldown === 0) {
			await onResend();
			setResendCooldown(60); // Reset cooldown
		}
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
		const { value } = e.target;
		if (/[^0-9]/.test(value)) return; // Only allow digits

		const newOtp = [...otp];
		newOtp[index] = value.slice(-1); // Take only the last digit
		setOtp(newOtp);

		// Move to the next input field if a digit is entered
		if (value && index < 5) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
		// Move to the previous input field on backspace if current is empty
		if (e.key === "Backspace" && !otp[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		const pasteData = e.clipboardData.getData("text").slice(0, 6);
		if (/^\d{6}$/.test(pasteData)) {
			const newOtp = pasteData.split("");
			setOtp(newOtp);
			inputRefs.current[5]?.focus();
		}
	};

	const handleSubmit = () => {
		const otpString = otp.join("");
		if (otpString.length === 6) {
			onVerify(otpString);
		}
	};

	const isButtonDisabled = otp.join("").length !== 6 || isVerifying;

	return (
		<div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-800 text-white p-8">
			<div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md space-y-6 shadow-2xl">
				<div className="text-center space-y-2">
					<h2 className="text-white text-2xl font-bold">
						Bestätige deine E-Mail
					</h2>
					<p className="text-gray-400 text-sm">
						Wir haben einen 6-stelligen Code an{" "}
						<span className="font-semibold text-white">{email}</span> gesendet.
					</p>
				</div>

				<div className="space-y-4">
					<div className="flex justify-center gap-2" onPaste={handlePaste}>
						{otp.map((digit, index) => (
							<input
								key={index}
								ref={(el) => (inputRefs.current[index] = el!)}
								type="text"
								maxLength={1}
								value={digit}
								onChange={(e) => handleChange(e, index)}
								onKeyDown={(e) => handleKeyDown(e, index)}
								className="w-12 h-14 bg-gray-800 text-white text-center text-2xl font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
							/>
						))}
					</div>

					{error && (
						<p className="text-red-500 text-xs text-center mt-2">{error}</p>
					)}

					<button
						type="button"
						onClick={handleSubmit}
						disabled={isButtonDisabled}
						className="w-full bg-blue-600 text-white py-3 px-4 rounded-full font-medium hover:bg-blue-500 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
					>
						{isVerifying ? "Überprüfe..." : "Bestätigen"}
					</button>

					<div className="text-center text-sm text-gray-400">
						Keinen Code erhalten?{" "}
						<button
							type="button"
							onClick={handleResendClick}
							disabled={resendCooldown > 0}
							className="font-medium text-blue-500 hover:text-blue-400 disabled:text-gray-500 disabled:cursor-not-allowed"
						>
							Code erneut senden{" "}
							{resendCooldown > 0 ? `(${resendCooldown}s)` : ""}
						</button>
					</div>
				</div>
			</div>
			<div className="mt-8">
				<button
					type="button"
					onClick={onBack}
					className="text-white hover:text-gray-200 font-medium opacity-80 hover:opacity-100 transition-opacity"
				>
					Zurück
				</button>
			</div>
		</div>
	);
}
