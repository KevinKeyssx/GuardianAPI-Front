import { gql } from 'graphql-request';

export const USERS_QUERY = gql`
    query Users($page: Int, $each: Int, $field: String, $orderBy: String) {
        users(page: $page, each: $each, field: $field, orderBy: $orderBy) {
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
            # attributes(keys: $attributeKeys) {
            #     key
            #     value
            # }
            total
        }
    }
`;