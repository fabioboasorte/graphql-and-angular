import { gql } from 'apollo-angular';

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      username
      age
      nationality
      phone
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      username
      age
      nationality
      phone
      address {
        street
        city
        state
        zip
      }
    }
  }
`;

export const GET_ALL_DATA = gql`
  query GetAllData {
    users {
      id
      name
      username
      age
      nationality
      phone
      address {
        street
        city
        state
        zip
      }
    }
  }
`;

export const GET_NATIONALITIES = gql`
  query GetNationalities {
    nationalities
  }
`;

export const ADD_USER = gql`
  mutation AddUser($input: AddUserInput!) {
    addUser(input: $input) {
      id
      name
      username
      age
      nationality
      phone
      address {
        street
        city
        state
        zip
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      name
      username
      age
      nationality
      phone
      address {
        street
        city
        state
        zip
      }
    }
  }
`;

export const GET_DATA = gql`
  query {
    __typename
  }
`;
