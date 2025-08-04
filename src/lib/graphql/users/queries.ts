import { gql } from 'graphql-request';


export const USER_ATTRIBUTES_QUERY = gql`
    query UserAttributes {
        userAttributes {
            key
        }
    }
`;


export const USERS_QUERY = gql`
    query Users {
        users {
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
