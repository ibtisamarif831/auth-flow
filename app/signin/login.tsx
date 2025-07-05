"use client";

import { useState, type FormEvent } from "react";
import { signinUser } from "./actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	const handleLogin = async (e: FormEvent) => {
		e.preventDefault(); // Prevents the default form submission behavior
		console.log("Logging in with:", { email, password });
		const { message, success } = await signinUser({
			email,
			password,
		});
		if (success) {
			router.push("/paywall"); // Redirect to the dashboard after successful login
		} else {
			alert(message);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-800 text-white p-8">
			{/* Login Form Card */}
			<div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md space-y-6 shadow-2xl">
				<div className="text-center space-y-2">
					<h2 className="text-white text-3xl font-bold">Willkommen zurück!</h2>
					<p className="text-gray-400">
						Melde dich bei deinem Theosis-Konto an.
					</p>
				</div>

				<form onSubmit={handleLogin} className="space-y-4">
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
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full bg-gray-800 text-white py-3 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
							placeholder="deine.email@beispiel.com"
							required
						/>
					</div>

					<div>
						<div className="flex justify-between items-center mb-1">
							<label
								htmlFor="password"
								className="block text-gray-300 text-sm font-medium"
							>
								Passwort
							</label>
							<Link
								href="/forgot-password"
								className="text-xs text-blue-400 hover:underline"
							>
								Passwort vergessen?
							</Link>
						</div>
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

					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-3 px-4 rounded-full font-medium hover:bg-blue-500 transition-colors duration-200 mt-2"
					>
						Anmelden
					</button>
				</form>

				<div className="text-center text-sm text-gray-400">
					Noch kein Konto?{" "}
					<Link
						href="/signup"
						prefetch
						className="font-medium text-blue-400 hover:underline"
					>
						Registrieren
					</Link>
				</div>
			</div>
		</div>
	);
}
