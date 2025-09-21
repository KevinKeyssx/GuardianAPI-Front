import { gql } from 'graphql-request';

export const ROLES_QUERY = gql`
    query Roles($page: Int, $each: Int) {
    # query Roles($page: Int, $each: Int, $field: String, $orderBy: String) {
        # roles(page: $page, each: $each, field: $field, orderBy: $orderBy) {
        roles(page: $page, each: $each) {
            id
            name
            description
            createdAt
            updatedAt
            isActive
        }
    }
`;


export const PERMISSIONS_QUERY = gql`
    query Permissions($page: Int, $each: Int) {
    # query Permissions($page: Int, $each: Int, $field: String, $orderBy: String) {
        # permissions(page: $page, each: $each, field: $field, orderBy: $orderBy) {
        permissions(page: $page, each: $each) {
            id
            name
            description
            createdAt
            updatedAt
            isActive
        }
    }
`;
