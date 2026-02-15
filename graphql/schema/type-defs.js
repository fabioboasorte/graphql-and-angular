const typeDefs = `#graphql
	type User {
		id: ID!
		name: String!
		username: String!
		age: Int!
		nationality: String!
		address: Address
	}

	type Address {
		street: String!
		city: String!
		state: String!
		zip: String!
	}

	input AddUserInput {
		name: String!
		username: String!
		age: Int!
		nationality: String!
		address: AddressInput!
	}

	input AddressInput {
		street: String!
		city: String!
		state: String!
		zip: String!
	}

	input UpdateAddressInput {
		street: String
		city: String
		state: String
		zip: String
	}

	input UpdateUserInput {
		name: String
		username: String
		age: Int
		nationality: String
		address: UpdateAddressInput
	}

	type Query {
		users: [User!]!
		user(id: ID!): User
		nationalities: [String!]!
	}

	type Mutation {
		addUser(input: AddUserInput!): User!
		updateUser(id: ID!, input: UpdateUserInput!): User!
		deleteUser(id: ID!): ID!
	}
`;

module.exports = { typeDefs };