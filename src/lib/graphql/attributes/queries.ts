import { gql } from 'graphql-request';

export const ATTRIBUTES_QUERY = gql`
    query Attributes($page: Int, $each: Int, $field: String, $orderBy: String, $attributeKeys: [String!]) {
        attributes(page: $page, each: $each, field: $field, orderBy: $orderBy) {
            id
            key
            value
            type
            required
            min
            max
            minLenght
            maxLenght
            minDate
            maxDate
            pattern
            active
            createdAt
            updatedAt
        }
    }
`;