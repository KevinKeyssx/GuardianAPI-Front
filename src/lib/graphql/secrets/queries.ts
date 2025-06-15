import { gql } from 'graphql-request';

export const SECRETS_QUERY = gql`
    query Secret {
        secret {
            id
            expiresAt
            willExpireAt
            isActive
            createdAt
            updatedAt
        }
    }
`;
