import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma.js";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { validateBetterAuthSignUp, validateSignUpData } from "./validate.js";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	emailAndPassword: {
		enabled: true,
	},
	user: {
		additionalFields: {
			roleId: {
				type: "string",
				input: true,
			},
			phone: {
				type: "string",
				input: true,
			},
		},
	},
	hooks: {
		before: createAuthMiddleware(async (ctx) => {
			if (ctx.path !== "/sign-up/email") {
				return;
			}
			await validateBetterAuthSignUp(ctx)
		}),
	},
	advanced: {
    database: {
      generateId: false,
    },
  },
});
