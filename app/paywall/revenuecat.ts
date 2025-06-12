"use server";

const API_KEY = process.env.REVENUECAT_API_KEY;

export const checkSubscriptionStatus = async (
	userId: string,
): Promise<boolean> => {
	const response = await fetch(
		`https://api.revenuecat.com/v2/projects/projc02f4016/customers/${userId}/`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${API_KEY}`,
			},
		},
	);
	const data = await response.json();
	if (data?.id.length > 0) {
		return true;
	}
	console.log("No subscription found for user:", userId);
	return false;
};
