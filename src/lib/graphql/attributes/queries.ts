import { gql } from 'graphql-request';

export const ATTRIBUTES_QUERY = gql`
    query UserAttributes {
        userAttributes {
            id
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
