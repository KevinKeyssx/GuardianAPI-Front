import { betterAuth } from "better-auth";

export const auth = betterAuth({
    secret  : ENV.BETTER_AUTH_SECRET,
    url     : ENV.BETTER_AUTH_URL,
    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
        github: {
			clientId        : ENV.GITHUB_CLIENT_ID,
			clientSecret    : ENV.GITHUB_CLIENT_SECRET,
			callbackUrl     : `${ENV.BETTER_AUTH_URL}/api/auth/callback/github`,
		},
	},
})