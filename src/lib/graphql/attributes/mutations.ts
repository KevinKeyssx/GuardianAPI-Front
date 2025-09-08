import { gql } from 'graphql-request';

export const CREATE_ATTRIBUTE_MUTATION = gql`
    mutation CreateUserAttribute( $createUserAttributeInput: CreateUserAttributeInput! ) {
        createUserAttribute( createUserAttributeInput: $createUserAttributeInput ) {
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

export const UPDATE_ATTRIBUTE_MUTATION = gql`
    mutation UpdateUserAttribute($updateUserAttributeInput: UpdateUserAttributeInput!) {
        updateUserAttribute( updateUserAttributeInput: $updateUserAttributeInput ) {
            id
            key
            defaultValue
            isActive
            type
            min
            max
            minLength
            maxLength
            pattern
            required
            maxDate
            minDate
            valueId
        }
    }
`;

export const DELETE_ATTRIBUTE_MUTATION = gql`
    mutation RemoveUserAttribute($removeUserAttributeId: ID!) {
        removeUserAttribute(id: $removeUserAttributeId) {
            id
        }
    }
`;
