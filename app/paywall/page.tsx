"use client";
import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import {
	createCheckoutSession,
	createCheckoutSessionWithpromo,
	fetchPromo,
	getUserId,
	getUserEmail,
} from "./actions";
import { checkSubscriptionStatus } from "./revenuecat";
const TheosisPaywall = () => {
	const [showPromoInput, setShowPromoInput] = useState(false);
	const [promoCode, setPromoCode] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [promoStatus, setPromoStatus] = useState<
		"idle" | "checking" | "valid" | "invalid"
	>("idle");
	const [appliedPromo, setAppliedPromo] = useState<{
		id: string;
		code: string;
		discount: number;
		discountType: string;
		currency: string;
	} | null>(null);
	const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);

	const originalPrice = 55;

	// Function to apply/validate promo code
	const handleApplyPromo = async () => {
		if (!promoCode.trim()) return;

		setPromoStatus("checking");
		try {
			const promo = await fetchPromo(promoCode);
			if (promo) {
				setPromoStatus("valid");
				setAppliedPromo(promo);
				// Calculate discounted price
				let newPrice = originalPrice;
				if (promo.discountType === "percentage") {
					newPrice = originalPrice * (1 - promo.discount / 100);
				} else {
					// Fixed amount discount (convert from cents if needed)
					newPrice = Math.max(0, originalPrice - promo.discount);
				}
				setDiscountedPrice(Math.round(newPrice * 100) / 100);
			} else {
				setPromoStatus("invalid");
				setAppliedPromo(null);
				setDiscountedPrice(null);
			}
		} catch (error) {
			console.error("Error validating promo:", error);
			setPromoStatus("invalid");
			setAppliedPromo(null);
			setDiscountedPrice(null);
		}
	};

	// Function to clear applied promo
	const handleClearPromo = () => {
		setPromoCode("");
		setPromoStatus("idle");
		setAppliedPromo(null);
		setDiscountedPrice(null);
	};
	// useEffect(() => {
	// 	const checkStatus = async () => {
	// 		const userId = await getUserId();
	// 		if (userId) {
	// 			const isSubscribed = await checkSubscriptionStatus(userId);
	// 			console.log("Subscription status:", isSubscribed);
	// 			if (isSubscribed) {
	// 				window.location.href = "/";
	// 			}
	// 		}
	// 	};

	// 	checkStatus();
	// }, []);
	const onSubscribeClick = async () => {
		setIsSubmitting(true);
		// Handle subscription logic here
		const userId = await getUserId();
		if (!userId) {
			alert("Bitte melde dich an, um fortzufahren.");
			console.error("User not authenticated");
			return;
		}

		const userEmail = await getUserEmail();
		if (!userEmail) {
			alert("E-Mail-Adresse nicht gefunden. Bitte melde dich erneut an.");
			console.error("User email not found");
			return;
		}

		try {
			let checkoutURL: string | null | undefined;

			if (appliedPromo && promoStatus === "valid") {
				checkoutURL = await createCheckoutSessionWithpromo(
					userId,
					userEmail,
					appliedPromo.id,
				);
			} else {
				// No promo applied, use regular checkout
				checkoutURL = await createCheckoutSession(userId, userEmail);
			}

			if (checkoutURL) {
				window.location.href = checkoutURL;
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
			<img
				src="/banner.png"
				alt="Religious Artwork"
				className="w-full h-auto object-cover mt-4"
			/>

			{/* Main Content */}
			<div className="flex flex-col items-center justify-center px-6 py-12 text-white">
				{/* Logo/Icon */}
				<div className="mb-8">
					<img src="/logo.png" alt="Theosis Logo" className="w-24 h-24 " />
				</div>

				{/* Main Heading */}
				<div className="text-center mb-8">
					<h1 className="text-4xl md:text-5xl font-bold mb-2">
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

				{/* Reviews */}
				<div className="mb-8 max-w-md backdrop-blur-sm bg-white/20 p-4 rounded-lg">
					<div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar scrollbar-thin scrollbar-track-white/10 scrollbar-thumb-white/30 hover:scrollbar-thumb-white/50 scrollbar-track-rounded-full scrollbar-thumb-rounded-full">
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
							<p className="mb-1">Wunderbar! Halleluja!</p>
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
							<p className="mb-1">Ein Muss für jeden Christen</p>
							<p className="text-sm opacity-80">
								Jeder Christ sollte diese App besitzen!
							</p>
						</div>

						{/* Review 3 */}
						<div className="text-left">
							<div className="flex justify-start mb-2">
								{[1, 2, 3, 4, 5].map((star) => (
									<Star
										key={star}
										className="w-5 h-5 fill-yellow-400 text-yellow-400"
									/>
								))}
							</div>
							<p className="mb-1">Hörbücher, die das Herz berühren</p>
							<p className="text-sm opacity-80">
								Die Hörbücher auf Theosis sind mehr als nur Texte - sie sprechen
								direkt zur Seele. Jeden Tag bekomme ich neue geistliche Impulse,
								die mich innerlich aufrichten und zum Nachdenken bringen. Durch
								die Stimmen, die die Heiligenleben, Predigten und patristischen
								Texte lebendig machen, wächst mein Verständnis für die Tiefe
								unseres Glaubens. Sie helfen mir, Christus nicht nur mit dem
								Verstand, sondern mit dem ganzen Herzen zu begegnen.
							</p>
						</div>

						{/* Review 4 */}
						<div className="text-left">
							<div className="flex justify-start mb-2">
								{[1, 2, 3, 4, 5].map((star) => (
									<Star
										key={star}
										className="w-5 h-5 fill-yellow-400 text-yellow-400"
									/>
								))}
							</div>
							<p className="mb-1">Endlich ist sie da</p>
							<p className="text-sm opacity-80">
								Ich habe mich so auf diese App gefreut - sie hilft mir, Gott
								täglich naherzukommen. Möge Gott euch segnen!
							</p>
						</div>

						{/* Review 5 */}
						<div className="text-left">
							<div className="flex justify-start mb-2">
								{[1, 2, 3, 4, 5].map((star) => (
									<Star
										key={star}
										className="w-5 h-5 fill-yellow-400 text-yellow-400"
									/>
								))}
							</div>
							<p className="mb-1">Genau darauf habe ich gewartet</p>
							<p className="text-sm opacity-80">
								Ich drücke auf einen Vers - und sehe sofort die Auslegung der
								ersten Christen. Seit Jahren habe ich mir genau das gewünscht!
							</p>
						</div>
					</div>
				</div>
				<div className="text-center text-sm opacity-90 mb-6">
					{appliedPromo && discountedPrice !== null ? (
						<div className="space-y-1">
							<p className="line-through text-gray-300 text-xs">
								{originalPrice}€ / Jahr
							</p>
							<p className="text-lg font-bold text-green-300">
								{discountedPrice}€ / Jahr ({(discountedPrice / 12).toFixed(2)}
								€/mo)
							</p>
							<p className="text-xs text-green-200">
								Ersparnis: {(originalPrice - discountedPrice).toFixed(2)}€
							</p>
						</div>
					) : (
						<p>
							<span>
								{originalPrice}€ / Jahr ({(originalPrice / 12).toFixed(2)}€/mo)
							</span>{" "}
							•{" "}
						</p>
					)}
				</div>
				{/* CTA Button */}
				<button
					type="button"
					disabled={isSubmitting}
					onClick={onSubscribeClick}
					className="w-full max-w-sm bg-white text-gray-800 font-semibold py-4 px-8 rounded-full hover:bg-gray-100 transition-colors mb-4 disabled:bg-gray-300 disabled:cursor-not-allowed"
				>
					Konto jetzt freischalten
				</button>
				<div className="mb-6 w-full max-w-sm">
					<p
						onClick={() => setShowPromoInput(!showPromoInput)}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								setShowPromoInput(!showPromoInput);
							}
						}}
						className="flex items-center justify-center text-sm opacity-70 mt-2 cursor-pointer hover:opacity-100 transition-opacity bg-transparent border-none"
					>
						Ich habe einen Code
					</p>

					{/* Promo Code Input */}
					{showPromoInput && (
						<div className="mt-4 space-y-3">
							<div className="flex gap-2">
								<input
									type="text"
									placeholder="Promo Code eingeben"
									value={promoCode}
									onChange={(e) => setPromoCode(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											handleApplyPromo();
										}
									}}
									className="flex-1 px-4 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
									disabled={
										promoStatus === "checking" || promoStatus === "valid"
									}
								/>
								{promoStatus !== "valid" && (
									<button
										type="button"
										onClick={handleApplyPromo}
										disabled={!promoCode.trim() || promoStatus === "checking"}
										className="px-6 py-3 bg-white/30 hover:bg-white/40 disabled:bg-white/10 disabled:cursor-not-allowed rounded-full text-white font-medium transition-colors backdrop-blur-sm"
									>
										{promoStatus === "checking" ? "Prüfe..." : "Anwenden"}
									</button>
								)}
							</div>

							{/* Promo Status Messages */}
							{promoStatus === "invalid" && (
								<div className="flex items-center gap-2 text-red-300 text-sm">
									<span>❌</span>
									<span>Ungültiger Promo Code</span>
								</div>
							)}

							{promoStatus === "valid" && appliedPromo && (
								<div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-3 border border-green-400/30">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2 text-green-300 text-sm">
											<span>✅</span>
											<span>Code "{appliedPromo.code}" angewendet</span>
										</div>
										<button
											type="button"
											onClick={handleClearPromo}
											className="text-green-300 hover:text-white text-xs underline"
										>
											Entfernen
										</button>
									</div>
									<div className="text-green-200 text-xs mt-1">
										{appliedPromo.discountType === "percentage"
											? `${appliedPromo.discount}% Rabatt`
											: `${appliedPromo.discount}€ Rabatt`}
									</div>
								</div>
							)}
						</div>
					)}
				</div>

				{/* Pricing */}

				{/* Footer Links */}
				<div className="mt-8 text-center space-y-2 text-sm opacity-70">
					<p>Terms of Service • Privacy Policy</p>
				</div>
			</div>
		</div>
	);
};

export default TheosisPaywall;
