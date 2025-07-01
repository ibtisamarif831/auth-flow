"use server";

import { createClient } from "@/utils/supabase/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2025-05-28.basil",
});
export const createCheckoutSession = async (
	userId: string,
	userEmail: string,
	promoCodeId?: string,
) => {
	try {
		// create stripe checkout page
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card", "paypal", "sepa_debit"],
			line_items: [
				{
					price: process.env.STRIPE_PRICE_ID_YEARLY,
					quantity: 1,
				},
			],
			mode: "subscription",
			success_url: "https://www.theosis-app.com/de/payment-success",
			cancel_url: "https://www.theosis-app.com/de",
			customer_email: userEmail,
			metadata: {
				user_id: userId,
			},
			subscription_data: {
				metadata: {
					user_id: userId,
				},
			},
		});
		return session.url; // Return the URL to redirect the user to the Stripe checkout page
	} catch (error) {
		console.error("Error creating checkout session:", error);
		throw new Error("Failed to create checkout session");
	}
};
export const createCheckoutSessionWithpromo = async (
	userId: string,
	userEmail: string,
	promoCodeId?: string,
) => {
	try {
		// create stripe checkout page
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card", "paypal", "sepa_debit"],
			line_items: [
				{
					price: process.env.STRIPE_PRICE_ID_YEARLY,
					quantity: 1,
				},
			],
			mode: "subscription",
			success_url: "https://www.theosis-app.com/de/payment-success",
			cancel_url: "https://www.theosis-app.com/de",
			customer_email: userEmail,
			metadata: {
				user_id: userId,
			},
			subscription_data: {
				metadata: {
					user_id: userId,
				},
			},
			discounts: [{ promotion_code: promoCodeId }],
		});
		return session.url; // Return the URL to redirect the user to the Stripe checkout page
	} catch (error) {
		console.error("Error creating checkout session:", error);
		throw new Error("Failed to create checkout session");
	}
};
export const fetchPromo = async (promoCode: string) => {
	const promotionCodes = await stripe.promotionCodes.list({
		code: promoCode,
		active: true,
		limit: 1,
	});

	if (!promotionCodes.data.length) {
		return null;
	}

	const promoData = promotionCodes.data[0];
	const coupon = promoData.coupon;

	return {
		id: promoData.id,
		code: promoData.code,
		discount:
			coupon.percent_off || (coupon.amount_off ? coupon.amount_off / 100 : 0),
		discountType: coupon.percent_off ? "percentage" : "fixed",
		currency: coupon.currency || "eur",
	};
};
export const getUserId = async () => {
	const supabase = await createClient();
	const userId = await supabase.auth
		.getUser()
		.then(({ data }) => data.user?.id);
	if (!userId) {
		console.error("User not authenticated");
		return null;
	}
	return userId;
};

export const getUserEmail = async () => {
	const supabase = await createClient();
	const user = await supabase.auth.getUser();
	if (!user.data.user?.email) {
		console.error("User email not found");
		return null;
	}
	return user.data.user.email;
};
