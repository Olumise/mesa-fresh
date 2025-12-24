import prisma from "../src/lib/prisma";

async function Main() {
	await prisma.dBRole.createManyAndReturn({
		data: [
			{
				name: "Admin",
			},
			{
				name: "Staff",
			},
		],
	});

	await prisma.staffRole.createManyAndReturn({
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
}

Main()
	.then(async () => {
		console.log("Seed added successfully!");
	})
	.catch((err) => {
		console.log(err);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
