import { gql } from 'graphql-request';


export const USER_ATTRIBUTES_QUERY = gql`
    query UserAttributes {
        userAttributes {
            key
        }
    }
`;


export const USERS_QUERY = gql`
    query Users(
        # $page: Int!,
        # $each: Int!,
        # $field: String!,
        $orderBy: String!,
        # $search: String,
    ) {
        users(
            # page: $page,
            # each: $each,
            # field: $field,
            # search: $search,
            orderBy: $orderBy,
        ) {
            id
            avatar
            email
            name
            nickname
            birthdate
            phone
            isActive
            isVerified
            createdAt
            updatedAt
            roles {
                name
            }
            attributes {
                id
                key
                value
                valueId
                type
                required
                max
                min
                pattern
                minLength
                maxLength
                minDate
                maxDate
            }
        }
    }
`;
