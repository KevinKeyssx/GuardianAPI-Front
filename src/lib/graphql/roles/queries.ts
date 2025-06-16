import { gql } from 'graphql-request';

export const ROLES_QUERY = gql`
    query Roles($page: Int, $each: Int, $field: String, $orderBy: String) {
        roles(page: $page, each: $each, field: $field, orderBy: $orderBy) {
            id
            name
            description
            createdAt
            updatedAt
        }
    }
`;


export const PERMISSIONS_QUERY = gql`
    query Permissions($page: Int, $each: Int, $field: String, $orderBy: String) {
        permissions(page: $page, each: $each, field: $field, orderBy: $orderBy) {
            id
            name
            description
            createdAt
            updatedAt
        }
    }
`;