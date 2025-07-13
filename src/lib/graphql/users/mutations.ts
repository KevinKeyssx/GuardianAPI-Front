// src/lib/graphql/users/mutations.ts

import { gql } from 'graphql-request';

export const CREATE_USER_MUTATION = gql`
    mutation CreateUser($input: CreateUserInput!) {
        createUser(createUserInput: $input) {
            email
            name
            avatar
            nickname
            birthdate
            phone
            isActive
            createdAt
            updatedAt
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
    mutation UpdateUser($input: UpdateUserInput!) {
        updateUser(updateUserInput: $input) {
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