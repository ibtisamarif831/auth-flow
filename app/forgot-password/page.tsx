"use client";

import { requestPasswordReset } from "./actions";

export default function ForgotPassword() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-800 text-white p-8">
			<div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md space-y-6 shadow-2xl">
				<div className="text-center space-y-2">
					<h2 className="text-white text-3xl font-bold">Passwort vergessen?</h2>
					<p className="text-gray-400">
						Geben Sie Ihre E-Mail-Adresse ein, um einen Link zum Zurücksetzen
						des Passworts zu erhalten.
					</p>
				</div>

				<form action={requestPasswordReset} className="space-y-4">
					<div>
						<label
							htmlFor="email"
							className="block text-gray-300 text-sm font-medium mb-1"
						>
							E-Mail
						</label>
						<input
							type="email"
							id="email"
							name="email"
							className="w-full bg-gray-800 text-white py-3 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
							placeholder="deine.email@beispiel.com"
							required
						/>
					</div>

					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-3 px-4 rounded-full font-medium hover:bg-blue-500 transition-colors duration-200 mt-2"
					>
						Senden
					</button>
				</form>
			</div>
		</div>
	);
}
