import { prismaError } from "prisma-better-errors";
import prisma from "../lib/prisma.js";

export const addDBRole = async () => {
	try {
		const dbRoles =  await prisma.dBRole.createManyAndReturn({
			data: [
				{
					name: "Admin",
				},
				{
					name: "Staff",
				},
			],
		});
		return dbRoles
	} catch (err: any) {
		throw new prismaError(err);
	}
};

export const getDBRoles =async ()=>{
	try{
		return prisma.dBRole.findMany()
	}catch(err:any){
		throw new prismaError(err)
	}
}