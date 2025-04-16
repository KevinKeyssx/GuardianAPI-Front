import { createAuthClient } from "better-auth/client"

// Configurar explícitamente la URL base para asegurar que coincida con la configuración
export const authClient = createAuthClient({
    baseUrl: "http://localhost:4321"
});