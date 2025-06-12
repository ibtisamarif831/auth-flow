"use client";

import { useRouter } from "next/navigation";

export default function WelcomePage() {
	const router = useRouter();

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-8">
			<div className="text-center space-y-4">
				<h1 className="text-5xl font-bold">Welcome to Theosis</h1>
				<p className="text-xl text-gray-400">
					Your journey to enlightenment begins here.
				</p>
			</div>
			<div className="mt-8">
				<span className="bg-blue-600 text-white py-3 px-6 rounded-full font-medium hover:bg-blue-500 transition-colors duration-200">
					Get Started
				</span>
			</div>
		</div>
	);
}
