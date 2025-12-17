import { auth } from "../lib/auth.js";

export const getUser = async (headers: any) => {
	try {
		const user = await auth.api.getSession({
			headers,
		});
		return user
	} catch (err: any) {
		throw new Error(err);
	}
};