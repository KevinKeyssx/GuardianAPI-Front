import { gql } from 'graphql-request';


// Mutation definition
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


// Interface for mutation variables
export interface UpdateUserAttributeValueVariables {
	updateUserAttributeValueId	: string;
	value						: any;
}


// Interface for mutation response
export interface UpdateUserAttributeValueResponse {
	updateUserAttributeValue: {
		id				: string;
		value			: any;
		userAttribute	: {
			key			: string;
			type		: string;
			required	: boolean;
			max			: string;
			min			: string;
			pattern		: string;
			minLength	: string;
			maxLength	: string;
			minDate		: string;
			maxDate		: string;
		};
	};
}


// Function to execute the mutation
// export const updateUserAttributeValue = async ( 
// 	variables: UpdateUserAttributeValueVariables 
// ): Promise<UpdateUserAttributeValueResponse> => {
// 	try {
// 		const response = await client.request<UpdateUserAttributeValueResponse>(
// 			UPDATE_USER_ATTRIBUTE_MUTATION,
// 			variables
// 		);

// 		return response;
// 	} catch ( error ) {
// 		console.error( 'Error updating user attribute value:', error );
// 		throw error;
// 	}
// };
