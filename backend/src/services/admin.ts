import { prismaError } from "prisma-better-errors";
import prisma from "../lib/prisma.js";
import { generateRandomUUID } from "../lib/helper.js";
import { Prisma, StaffInvitation } from "../../generated/prisma/client.js";
import { validateStaffInvitationCreation } from "../lib/validate.js";

export const addDBRole = async () => {
	try {
		const dbRoles = await prisma.dBRole.createManyAndReturn({
			data: [
				{
					name: "Admin",
				},
				{
					name: "Staff",
				},
			],
		});
		return dbRoles;
	} catch (err: any) {
		throw new prismaError(err);
	}
};

export const getDBRoles = async () => {
	try {
		return prisma.dBRole.findMany();
	} catch (err: any) {
		throw new prismaError(err);
	}
};

export const inviteUser = async (data: any) => {
	validateStaffInvitationCreation(data);
	const { invited_by, invited_email, invitation_code, location_id } = data;
	try {
		const inviter = await prisma.user.findUnique({
			where: {
				id: invited_by,
			},
		});
		if (!inviter) {
			throw new Error("The Inviter does not exist!");
		}
		const newInvitation = await prisma.staffInvitation.create({
			data: {
				invited_email,
				invited_by,
				invitation_code,
				location_id,
			},
			include: {
				inviter: true,
			},
		});
		return newInvitation;
	} catch (err: any) {
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			throw new prismaError(err);
		}
		throw new Error(err);
	}
};
