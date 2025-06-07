"use client";
import React, { useState } from "react";
import { Star } from "lucide-react";
import {
	createCheckoutSession,
	createCheckoutSessionWithpromo,
	fetchPromo,
	getUserId,
} from "./actions";
const TheosisPaywall = () => {
	const [showPromoInput, setShowPromoInput] = useState(false);
	const [promoCode, setPromoCode] = useState("");
	const onSubscribeClick = async () => {
		// Handle subscription logic here
		const userId = await getUserId();
		if (!userId) {
			console.error("User not authenticated");
			return;
		}

		try {
			let checkoutURL: string | null | undefined;

			if (promoCode) {
				const promo = await fetchPromo(promoCode);
				if (promo) {
					checkoutURL = await createCheckoutSessionWithpromo(userId, promo);
				} else {
					console.error("Invalid promo code");
					return;
				}
			} else {
				// You'll need to create a function for checkout without promo
				checkoutURL = await createCheckoutSession(userId);
			}

			if (checkoutURL) {
				window.open(checkoutURL, "_blank");
			}
		} catch (error) {
			console.error("Error creating checkout session:", error);
		}
	};
	return (
		<div
			className="min-h-screen w-full"
			style={{
				background: "linear-gradient(to bottom, #51CADE9A, #117298FD, #46ADD6)",
			}}
		>
			{/* Header with Religious Artwork */}
			<div className="w-full overflow-hidden">
				<div className="flex space-x-1 p-2">
					{/* Placeholder religious artwork images */}
					{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
						<div
							key={item}
							className="flex-shrink-0 w-32 h-20 bg-gradient-to-br from-blue-900 to-purple-600 rounded-lg opacity-80 relative overflow-hidden"
						>
							<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
							<div className="absolute bottom-1 left-1 text-white text-xs opacity-70">
								Scene {item}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Main Content */}
			<div className="flex flex-col items-center justify-center px-6 py-12 text-white">
				{/* Logo/Icon */}
				<div className="mb-8">
					<div className="w-16 h-16 border-2 border-white rounded-lg flex items-center justify-center">
						<div className="text-2xl font-bold">T</div>
					</div>
				</div>

				{/* Main Heading */}
				<div className="text-center mb-8">
					<h1 className="text-4xl md:text-5xl font-light mb-2">
						Schalte jetzt dein
						<br />
						Theosis Konto frei
					</h1>
				</div>

				{/* Features */}
				<div className="text-center mb-8">
					<p className="text-lg opacity-90">
						Täglich inspirierende Hörgeschichten
					</p>
					<p className="text-lg opacity-90">120.000+ Bibel Exegesen</p>
					<p className="text-lg opacity-90">Und über 2.000 Werke</p>
				</div>

				{/* Pricing Button */}
				<div className="mb-6">
					<div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-8 py-3 text-white font-medium hover:bg-white/30 transition-all">
						Jährlich •{" "}
						<span className="text-yellow-300 font-semibold">43% SPAREN</span>
					</div>
					<button
						type="button"
						onClick={() => setShowPromoInput(!showPromoInput)}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								setShowPromoInput(!showPromoInput);
							}
						}}
						className="text-center text-sm opacity-70 mt-2 cursor-pointer hover:opacity-100 transition-opacity bg-transparent border-none"
					>
						Ich habe einen Code
					</button>

					{/* Promo Code Input */}
					{showPromoInput && (
						<div className="mt-4 w-full  mx-auto">
							<input
								type="text"
								placeholder="Promo Code eingeben"
								value={promoCode}
								onChange={(e) => setPromoCode(e.target.value)}
								className="w-full px-4 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
							/>
						</div>
					)}
				</div>

				{/* Reviews */}
				<div className="space-y-4 mb-8 max-w-md  backdrop-blur-sm bg-white/20 p-4 rounded-lg">
					{/* Review 1 */}
					<div className="text-left">
						<div className="flex justify-start mb-2">
							{[1, 2, 3, 4, 5].map((star) => (
								<Star
									key={star}
									className="w-5 h-5 fill-yellow-400 text-yellow-400"
								/>
							))}
						</div>
						<p className=" mb-1">Wunderbar! Halleluja!</p>
						<p className="text-sm opacity-80">
							Ehre sei Gott für diese App! Ich weiß, sie wird mich im
							Bibelstudium aufs höchste Level bringen. Halleluja!
						</p>
					</div>

					{/* Review 2 */}
					<div className="text-left">
						<div className="flex justify-start mb-2">
							{[1, 2, 3, 4, 5].map((star) => (
								<Star
									key={star}
									className="w-5 h-5 fill-yellow-400 text-yellow-400"
								/>
							))}
						</div>
						<p className="">Ein Muss für jeden Christen</p>
					</div>
				</div>

				{/* CTA Button */}
				<button
					type="button"
					onClick={onSubscribeClick}
					className="w-full max-w-sm bg-white text-gray-800 font-semibold py-4 px-8 rounded-full hover:bg-gray-100 transition-colors mb-4"
				>
					Konto jetzt freischalten
				</button>

				{/* Pricing */}
				<p className="text-center text-sm opacity-90">
					<span>55€ / Jahr (4.58€/mo)</span> •{" "}
				</p>

				{/* Footer Links */}
				<div className="mt-8 text-center space-y-2 text-sm opacity-70">
					<p>Terms of Service • Privacy Policy</p>
				</div>
			</div>
		</div>
	);
};

export default TheosisPaywall;
