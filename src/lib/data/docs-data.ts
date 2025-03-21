
export const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      content: `
        GuardianApi provides a secure and easy-to-implement authentication solution for your web applications. Follow our step-by-step guide to integrate authentication into your project.
  
        ## Installation
        \`\`\`bash
        npm install @guardian-api/core
        \`\`\`
  
        ## Basic Setup
        \`\`\`javascript
        import { GuardianApi } from '@guardian-api/core';
  
        const guardian = new GuardianApi({
          apiKey: 'your-api-key',
          projectId: 'your-project-id'
        });
        \`\`\`
      `
    },
    {
      id: 'api-reference',
      title: 'API Reference',
      content: `
        ## Authentication Endpoints
  
        ### POST /auth/signup
        Create a new user account.
  
        \`\`\`typescript
        interface SignUpRequest {
          email: string;
          password: string;
          fullName: string;
        }
        \`\`\`
  
        ### POST /auth/signin
        Authenticate an existing user.
  
        \`\`\`typescript
        interface SignInRequest {
          email: string;
          password: string;
        }
        \`\`\`
      `
    },
    {
      id: 'security',
      title: 'Security Features',
      content: `
        ## JWT Tokens
        GuardianApi uses industry-standard JWT tokens for secure authentication.
  
        ## Rate Limiting
        Built-in rate limiting protects your API from abuse:
        - 100 requests per minute for authenticated users
        - 20 requests per minute for unauthenticated users
  
        ## Data Encryption
        - All sensitive data is encrypted at rest using AES-256
        - TLS 1.3 for all API communications
      `
    },
    {
      id: 'examples',
      title: 'Examples',
      content: `
        ## React Integration
  
        \`\`\`typescript
        import { useGuardian } from '@guardian-api/react';
  
        function App() {
          const { signIn, user } = useGuardian();
  
          const handleLogin = async (credentials) => {
            await signIn(credentials);
          };
        }
        \`\`\`
  
        ## Vue Integration
  
        \`\`\`typescript
        import { useGuardian } from '@guardian-api/vue';
  
        export default {
          setup() {
            const { signIn, user } = useGuardian();
            // ...
          }
        }
        \`\`\`
      `
    }
  ];