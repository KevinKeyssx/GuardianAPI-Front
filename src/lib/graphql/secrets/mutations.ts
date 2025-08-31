import { gql } from 'graphql-request';

export const GENERATE_SECRET_MUTATION = gql`
    mutation GenerateSecret($createSecretInput: CreateSecretInput!) {
        generateSecret(createSecretInput: $createSecretInput) {
            secret
            secretData {
                name
                expiresAt
            }
        }
    }
`;


export const UPDDATE_SECRET_MUTATION = gql`
    mutation ExpiresAtSecret($updateSecretInput: UpdateSecretInput!) {
        expiresAtSecret(updateSecretInput: $updateSecretInput) {
            name
            expiresAt
            id
        }
    }
`


export const DELETE_SECRET_MUTATION = gql`
    mutation RemoveSecret($removeSecretId: ID!) {
        removeSecret(id: $removeSecretId)
    }
`;
