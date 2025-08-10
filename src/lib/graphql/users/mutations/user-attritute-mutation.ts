import { gql } from 'graphql-request';


export const UPDATE_USER_ATTRIBUTE_MUTATION = gql`
	mutation UpdateUserAttributeValue( $updateUserAttributeValueId: ID!, $value: JSON! ) {
		updateUserAttributeValue( id: $updateUserAttributeValueId, value: $value ) {
			id
			value
			userAttribute {
				key
			}
		}
	}
`;


export const CREATE_USER_ATTRIBUTE_MUTATION = gql`
    mutation Mutation( $createUserAttributeValueInput: CreateUserAttributeValueInput! ) {
        createUserAttributeValue( createUserAttributeValueInput: $createUserAttributeValueInput ) {
            id
            value
            userAttribute {
                key
            }
        }
    }
`;
