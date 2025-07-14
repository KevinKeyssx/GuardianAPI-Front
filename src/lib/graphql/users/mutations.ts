// src/lib/graphql/users/mutations.ts

import { gql } from 'graphql-request';

export const CREATE_USER_MUTATION = gql`
    mutation CreateUser($createUserInput: CreateUserInput!, $file: Upload) {
        createUser(createUserInput: $createUserInput, file:$file) {
            email
            name
            avatar
            nickname
            birthdate
            phone
            isActive
            createdAt
            updatedAt
            roles {
                name
            }
            attributes {
                type
                key
                value
                required
            }
        }
    }
`;

export const UPDATE_USER_MUTATION = gql`
    mutation UpdateUser($updateUserInput: UpdateUserInput!, $file: Upload) {
        updateUser(updateUserInput: $updateUserInput, file: $file) {
            id
            avatar
            email
            name
            nickname
            birthdate
            phone
            isActive
            createdAt
            updatedAt
            roles {
                name
            }
            attributes {
                type
                key
                value
                required
            }
        }
    }
`;
export const DELETE_USER_MUTATION = gql`
    mutation DeleteUser($id: String!) {
        deleteUser(id: $id)
    }
`;