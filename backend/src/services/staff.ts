import { prismaError } from "prisma-better-errors";
import prisma from "../lib/prisma.js";
import { Manager, Prisma, Staff } from "../../generated/prisma/client.js";
import { validateManagerInput, validateNewStaffData } from "../lib/validate.js";
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
		return prisma.$transaction(async (tx) => {
			const role = await tx.staffRole.findUnique({
				where: {
					id: role_id,
				},
			});
			const invitation = await tx.staffInvitation.findUnique({
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

			const newStaff = await tx.staff.create({
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

			if (role?.name === "Manager") {
				const manager = await tx.manager.create({
					data: {
						location_id: location_id,
						staff_id: newStaff.id,
					},
				});
			}
			await tx.staffInvitation.update({
				where: {
					id: newStaff.invitation_id,
				},
				data: {
					is_accepted: true,
					accepted_at: new Date().toISOString(),
				},
			});
			return newStaff;
		});
	} catch (err: any) {
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			throw new prismaError(err);
		}
		throw new Error(err);
	}
};

export const addManager = async (data: Manager) => {
	validateManagerInput(data);
	const { location_id, staff_id } = data;
	try {
		const manager = await prisma.manager.create({
			data,
			include: {
				staff: true,
				location: true,
			},
		});
		return manager;
	} catch (err: any) {
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			throw new prismaError(err);
		}
		throw new Error(err);
	}
};
