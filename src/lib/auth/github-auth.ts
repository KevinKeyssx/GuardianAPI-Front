export async function setupAuthGithub() {
    try {
        const { createAuthClient }  = await import('better-auth/client');
        const authClient            = createAuthClient();
        console.log('🚀 ~ file: signin.astro:10 ~ authClient:', authClient);
        try {
            const data = await authClient.signIn.social({
                provider: "github"
            });
            console.log('Sign in successful:', data.data);
        } catch (error) {
            console.error('Sign in failed:', error);
        }
    } catch (error) {
        console.error('Error setting up auth:', error);
    }
}