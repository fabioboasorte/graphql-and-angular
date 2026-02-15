import { ApolloProvider, useQuery, useMutation, gql } from "@apollo/client";
import { useState } from "react";
import apolloClient from "./apolloClient";

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      username
      age
      nationality
      address {
        street
        city
        state
        zip
      }
    }
  }
`;

const ADD_USER = gql`
  mutation AddUser($input: AddUserInput!) {
    addUser(input: $input) {
      id
      name
      username
      age
      nationality
      address {
        street
        city
        state
        zip
      }
    }
  }
`;

function UserList() {
  const { data, loading, error, refetch } = useQuery(GET_USERS);
  const [addUser] = useMutation(ADD_USER, {
    onCompleted: () => refetch(),
  });
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [nationality, setNationality] = useState("");
  const [address, setAddress] = useState({ street: "", city: "", state: "", zip: "" });
  
  const handleAddUser = (e) => {
    e.preventDefault();
    addUser({
      variables: {
        input: { name, username, age: parseInt(age), nationality, address },
      },
    });
    setName("");
    setUsername("");
    setAge("");
    setNationality("");
    setAddress({ street: "", city: "", state: "", zip: "" });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Users</h1>
      <ul>
        {data?.users?.map((user) => (
          <li key={user.id}>
            {user.name} (@{user.username}) - {user.age} - {user.nationality}
            <br />
            {user.address.street} - {user.address.city} - {user.address.state} - {user.address.zip}
          </li>
        ))}
      </ul>

      <h2>Add User</h2>
      <form onSubmit={handleAddUser}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <input
          placeholder="Nationality"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          required
        />
        <input
          placeholder="Street"
          value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
          required
        />
        <input
          placeholder="City"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
          required
        />
        <input
          placeholder="State"
          value={address.state}
          onChange={(e) => setAddress({ ...address, state: e.target.value })}
          required
        />
        <input
          placeholder="Zip"
          value={address.zip}
          onChange={(e) => setAddress({ ...address, zip: e.target.value })}
          required
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <UserList />
    </ApolloProvider>
  );
}
