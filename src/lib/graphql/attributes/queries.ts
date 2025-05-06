import { gql } from 'graphql-request';

export const ATTRIBUTES_QUERY = gql`
    query UserAttributes($keys: [String!]) {
        userAttributes(keys: $keys) {
            key
            defaultValue
            type
            required
            min
            max
            minLength
            maxLength
            minDate
            maxDate
            pattern
            isActive
        }
    }
`;