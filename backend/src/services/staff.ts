import { prismaError } from "prisma-better-errors";
import prisma from "../lib/prisma.js";
import { Prisma, Staff } from "../../generated/prisma/client.js";
import { validateNewStaffData } from "../lib/validate.js";
import { includes } from "zod";

export interface StaffExtendedInput extends Staff {
	invitation_code: string;
}

export const addStaffRoles = async () => {
	try {
		const staffRoles = await prisma.staffRole.createManyAndReturn({
			data: [
				{
					name: "Manager",
				},
				{
					name: "Line Server",
				},
				{
					name: "Cashier",
				},
				{
					name: "Cleaner",
				},
			],
		});

		return staffRoles;
	} catch (err: any) {
		throw new prismaError(err);
	}
};

export const addStaff = async (data: StaffExtendedInput) => {
	validateNewStaffData(data);
	const {
		location_id,
		user_id,
		date_joined,
		is_active,
		role_id,
		invitation_code,
	} = data;
	try {
		const invitation = await prisma.staffInvitation.findUnique({
			where: {
				invitation_code,
			},
		});
		if (!invitation || invitation.is_accepted) {
			throw new Error("Invitation Code not valid!");
		}
		const user = await prisma.user.findUnique({
			where: {
				id: user_id,
			},
		});
		if (invitation.invited_email !== user?.email) {
			throw new Error("User email does not correspond with invited email!");
		}
		const newStaff = await prisma.staff.create({
			data: {
				location_id,
				user_id,
				date_joined,
				is_active,
				role_id,
				invitation_id: invitation.id,
			},
			include: {
				user: true,
				location: true,
				role: true,
			},
		});
		const markInvitation = await prisma.staffInvitation.update({
			where: {
				id: newStaff.invitation_id,
			},
			data: {
				is_accepted: true,
				accepted_at: new Date().toISOString(),
			},
		});
		return newStaff;
	} catch (err: any) {
		if (err instanceof Prisma.PrismaClientKnownRequestError)  {
			throw new prismaError(err);
		}
		throw new Error(err);
	}
};
