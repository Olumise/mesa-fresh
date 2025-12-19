import { prismaError } from "prisma-better-errors";
import prisma from "../lib/prisma.js";
import { Staff } from "../../generated/prisma/client.js";
import { validateNewStaffData } from "../lib/validate.js";

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
		const invitationId = await prisma.staffInvitation.findUnique({
			where: {
				invitation_code,
			},
		});
		if (!invitationId) {
			throw new Error("Invitation Code not valid!");
		}
		const newStaff = await prisma.staff.create({
			data: {
				location_id,
				user_id,
				date_joined,
				is_active,
				role_id,
				invitation_id: invitationId.id,
			},
			include: {
				user: true,
				location: true,
				role: true,
			},
		});
		return newStaff
	} catch (err: any) {
		throw new prismaError(err);
	}
};

