import { gql } from 'graphql-request';

export const SECRETS_QUERY = gql`
    query Secret {
        secret {
            id
            name
            expiresAt
            willExpireAt
            isActive
            createdAt
            updatedAt
        }
    }
`;
