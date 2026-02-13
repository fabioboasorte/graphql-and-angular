const typeDefs = `#graphql
	type User {
		id: ID!
		name: String!
		username: String!
		age: Int!
		nationality: String!
	}

	input AddUserInput {
		name: String!
		username: String!
		age: Int!
		nationality: String!
	}

	input UpdateUserInput {
		name: String
		username: String
		age: Int
		nationality: String
	}

	type Query {
		users: [User!]!
		user(id: ID!): User
		nationalities: [String!]!
	}

	type Mutation {
		addUser(input: AddUserInput!): User!
		updateUser(id: ID!, input: UpdateUserInput!): User!
	}
`;

module.exports = { typeDefs };