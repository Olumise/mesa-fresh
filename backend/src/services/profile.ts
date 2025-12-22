import { prismaError } from "prisma-better-errors";
import { User } from "../../generated/prisma/client.js";
import { auth } from "../lib/auth.js";
import prisma from "../lib/prisma.js";
import { uploadedFile, uploadFile } from "./upload.js";

export const getUser = async (headers: any) => {
	try {
		const user = await auth.api.getSession({
			headers,
		});
		return user;
	} catch (err: any) {
		throw new Error(err);
	}
};

export const editUserImage = async (file: uploadedFile, userId: string) => {
	const prefix = `profile-image-${userId.replaceAll("-", "")}`;
	const image = await uploadFile(file, prefix);

	try {
		const updatedUser = await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				image: image.url,
			},
		});
		return updatedUser
	} catch (err: any) {
		throw new prismaError(err);
	}
};
