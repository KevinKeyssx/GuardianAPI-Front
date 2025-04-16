import { createAuthClient } from "better-auth/client"

export const authClient = createAuthClient({
    baseUrl: "http://localhost:4321"
});