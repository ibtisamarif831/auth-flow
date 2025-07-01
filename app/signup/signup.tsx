"use client";

import { useState } from "react";
import ValidationRule from "./validation-rule";
// Import the new component
// Import the new actions
import { signupUser, verifyOtp, resendOtp } from "./actions";
import OtpVerification from "./otp";

export default function SignUp() {
	// The flow now has more steps. Start at 1.
	const [currentStep, setCurrentStep] = useState(1);
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	// Add state for OTP verification
	const [otpError, setOtpError] = useState<string | null>(null);

	const nextStep = () => {
		// We now have 4 main steps + a success screen
		if (currentStep < 5) {
			setCurrentStep(currentStep + 1);
		}
	};

	const prevStep = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	// This function now just handles the initial signup and moves to OTP step
	const handleSignup = async () => {
		if (isSubmitting) return;
		setIsSubmitting(true);

		const response = await signupUser({ email, password });

		if (response.success) {
			// On success, move to the OTP verification step
			nextStep();
		} else {
			// Handle errors like "email already exists"
			alert(response.message); // Replace with a better UI element
		}

		setIsSubmitting(false);
	};

	// New handler for verifying the OTP
	const handleVerifyOtp = async (otp: string) => {
		if (isSubmitting) return;
		setIsSubmitting(true);
		setOtpError(null); // Clear previous errors

		const response = await verifyOtp({ email, otp });

		if (response.success) {
			nextStep(); // Move to the final success screen
		} else {
			setOtpError(response.error ?? "An unknown error occurred.");
		}
		setIsSubmitting(false);
	};

	// New handler for resending the OTP
	const handleResendOtp = async () => {
		// You can add a small notification/toast here if you like
		console.log("Resending OTP...");
		await resendOtp({ email });
		console.log("OTP Resent");
	};

	const validatePassword = (text: string) => {
		const hasUppercase = /[A-Z]/.test(text);
		const hasSpecialChar = /[!@%^&*().\/;<=>[\]\|*\$]/.test(text);
		const hasDigit = /\d/.test(text);
		const isValidLength = text.length >= 8;

		return hasUppercase && hasSpecialChar && hasDigit && isValidLength;
	};

	return (
		<div className="min-h-screen flex items-center justify-center min-w-[100%]">
			{/* Step 1: Welcome Screen (No Changes) */}
			{currentStep === 1 && (
				<div className="min-h-screen flex flex-col justify-between text-white p-8 w-full relative overflow-hidden bg-cover bg-center bg-no-repeat bg-[url('/back.jpg')]">
					{/* --- THIS DIV IS NOW THE GRADIENT OVERLAY --- */}
					<div className="absolute inset-0 z-0 bg-gradient-to-r from-[#46ADD6] to-[#46ADD6]/60" />
					<div className="relative z-10 flex flex-col justify-between flex-1">
						<div className="flex-1 flex items-center justify-center">
							<div className="max-w-2xl">
								<h2 className="text-4xl lg:text-5xl font-bold">
									Willkommen bei Theosis!
								</h2>
								<p className="text-xl mb-6">
									Bevor es losgeht, sag uns kurz etwas über dich.
								</p>
								<p className="text-sm leading-relaxed opacity-90">
									Wir wissen, dass der Glaube ein sehr persönliches Thema ist.
									Wir behandeln deine Angaben mit größtem Respekt und verwenden
									sie ausschließlich, um dir ein tieferes geistliches Erlebnis
									zu ermöglichen. Deine Daten werden niemals verkauft oder an
									Dritte weitergegeben.
								</p>
							</div>
							<button
								type="button"
								onClick={nextStep}
								className="bg-white text-blue-600 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors duration-200 shadow-lg ml-8 w-fit self-end"
							>
								Weiter
							</button>
						</div>
						<div className="text-xs opacity-75 max-w-full self-center mt-4 text-center">
							*Wenn du auf "Weiter" tappst, erklärst du dich mit der
							Verarbeitung dieser Daten einverstanden. Siehe unsere{" "}
							<span className="underline cursor-pointer">
								Datenschutzrichtlinie
							</span>{" "}
							für weitere Details.
						</div>
					</div>
				</div>
			)}

			{/* Step 2: Quote Screen (No Changes) */}
			{currentStep === 2 && (
				<div className="text-center text-white space-y-12 bg-[#46ADD6] min-h-screen flex flex-col items-start justify-center p-80 w-full">
					<div className="flex items-center space-y-8 gap-x-6">
						<div className="w-32 h-32 rounded-full overflow-hidden bg-white/20 backdrop-blur-sm shadow-2xl">
							<img
								src="/sir.jpg"
								alt="Heiliger Altvater Paisios"
								className="w-full h-full object-cover"
							/>
						</div>
						<div className="max-w-2xl space-y-6 text-left">
							<blockquote className="text-2xl lg:text-3xl font-light leading-relaxed opacity-90">
								„Das <span className="font-bold">Ziel</span> ist es,{" "}
								<span className="font-semibold">geistlich zu wachsen</span> –
								nicht einfach nur, Sünde zu vermeiden."
							</blockquote>
							<div className="space-y-2 opacity-80">
								<p className="text-lg font-medium">Heiliger Altvater Paisios</p>
								<p className="text-sm">vom Berg Athos</p>
							</div>
						</div>
					</div>
					<div className="flex gap-4 justify-between w-full mt-12">
						<button
							type="button"
							onClick={prevStep}
							className="bg-white/20 text-white px-6 py-3 rounded-full font-medium hover:bg-white/30 transition-colors duration-200 backdrop-blur-sm"
						>
							Zurück
						</button>
						<button
							type="button"
							onClick={nextStep}
							className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors duration-200 shadow-lg"
						>
							Weiter
						</button>
					</div>
				</div>
			)}

			{/* Step 3: Signup Options (Minor change to onClick) */}
			{currentStep === 3 && (
				<div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-800 text-white p-8">
					<div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md space-y-6 shadow-2xl">
						<div className="text-center space-y-2">
							<div>
								<img
									src="/download.jpeg"
									alt="Theosis Logo"
									className="w-16 h-16 mx-auto mb-2 rounded-md"
								/>
								<h2 className="text-white text-2xl font-bold">Theosis</h2>
							</div>

							<p className="text-gray-400 text-sm">
								Bitte erstelle ein Konto, um fortzufahren.
							</p>
						</div>
						<div className="space-y-4">
							<div>
								<label
									htmlFor="email"
									className="block text-gray-300 text-sm font-medium mb-1"
								>
									E-Mail
								</label>
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									id="email"
									className="w-full bg-gray-800 text-white py-3 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
									placeholder="E-Mail-Adresse"
								/>
							</div>
							<div>
								<label
									htmlFor="password"
									className="block text-gray-300 text-sm font-medium mb-1"
								>
									Passwort
								</label>
								<input
									type="password"
									id="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full bg-gray-800 text-white py-3 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
									placeholder="Passwort"
								/>
								<div className="space-y-1 mt-2">
									<ValidationRule
										isValid={/[A-Z]/.test(password)}
										text="Mindestens ein Großbuchstabe"
									/>
									<ValidationRule
										isValid={/\d/.test(password)}
										text="Mindestens eine Zahl"
									/>
									<ValidationRule
										isValid={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(
											password,
										)}
										text="Mindestens ein Sonderzeichen"
									/>
									<ValidationRule
										isValid={password.length >= 8}
										text="Mindestens 8 Zeichen lang"
									/>
								</div>
							</div>
							{password && !validatePassword(password) && (
								<p className="text-red-500 text-xs mt-1">
									Das Passwort entspricht nicht den Anforderungen.
								</p>
							)}
							<button
								type="button"
								onClick={handleSignup}
								disabled={!validatePassword(password) || !email || isSubmitting}
								className="w-full bg-blue-600 text-white py-3 px-4 rounded-full font-medium hover:bg-blue-500 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
							>
								{isSubmitting ? "Registriere..." : "Registrieren"}
							</button>
						</div>
						<div className="text-center text-xs text-gray-500 mt-6">
							Durch die Nutzung von Theosis erklärst du dich mit unseren{" "}
							<span className="underline cursor-pointer hover:text-gray-400">
								Nutzungsbedingungen
							</span>{" "}
							und{" "}
							<span className="underline cursor-pointer hover:text-gray-400">
								Datenschutzbestimmungen
							</span>{" "}
							einverstanden.
						</div>
						<div className="text-center text-sm text-gray-400 mt-4">
							Hast du bereits ein Konto?{" "}
							<button
								type="button"
								onClick={() => {
									window.location.href = "/signin";
								}}
								className="text-blue-400 hover:text-blue-300 underline font-medium transition-colors duration-200"
							>
								Anmelden
							</button>
						</div>
					</div>
					<div className="mt-8">
						<button
							type="button"
							onClick={prevStep}
							className="text-white hover:text-gray-200 font-medium opacity-80 hover:opacity-100 transition-opacity"
						>
							Zurück
						</button>
					</div>
				</div>
			)}

			{/* **** NEW STEP 4: OTP Verification **** */}
			{currentStep === 4 && (
				<OtpVerification
					email={email}
					onVerify={handleVerifyOtp}
					onResend={handleResendOtp}
					onBack={prevStep}
					isVerifying={isSubmitting}
					error={otpError}
				/>
			)}

			{/* **** NEW STEP 5: Success Screen **** */}
			{currentStep === 5 && (
				<div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-800 text-white p-8">
					<div className="text-center space-y-4">
						<h2 className="text-4xl font-bold text-green-400">
							Registrierung erfolgreich!
						</h2>
						<p className="text-gray-300">
							Willkommen bei Theosis. Dein Konto wurde erstellt.
						</p>
						<button
							type="button"
							// This would typically redirect to the dashboard or main app
							onClick={() => {
								window.location.href = "/paywall";
							}}
							className="bg-blue-600 text-white py-3 px-8 rounded-full font-medium hover:bg-blue-500 transition-colors duration-200"
						>
							Weiter zur Paywall
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
