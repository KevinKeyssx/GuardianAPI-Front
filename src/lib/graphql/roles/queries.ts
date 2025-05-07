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