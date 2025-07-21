import { gql } from 'graphql-request';


export const USER_ATTRIBUTES_QUERY = gql`
    query UserAttributes {
        userAttributes {
            key
            type
            required
        }
    }
`;


export const USERS_QUERY = gql`
    # query Users($page: Int, $each: Int, $field: String, $orderBy: String, $keys: [String!]) {
    #     users {
    #     # users( page: $page, each: $each, field: $field, orderBy: $orderBy, keys: $keys ) {
    #         id
    #         avatar
    #         email
    #         name
    #         nickname
    #         birthdate
    #         phone
    #         isActive
    #         createdAt
    #         updatedAt
    #         roles {
    #             name
    #         }
    #         # attributes (keys: $keys){
    #         attributes {
    #             type
    #             key
    #             value
    #             required
    #         }
    #     }
    # }

    # query Users($keys: [String!]) {
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
            # attributes(keys: $keys) {
            attributes {
                key
                value
                # type
                # required
            }
        }
    }
`;