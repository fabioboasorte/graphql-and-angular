import { Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      username
      age
      nationality
    }
  }
`;

interface User {
  id: string;
  name: string;
  username: string;
  age: number;
  nationality: string;
}

interface GetUsersResponse {
  users: User[];
}

@Component({
  selector: 'app-users',
  imports: [AsyncPipe, JsonPipe, RouterLink],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  private readonly apollo = inject(Apollo);

  result$ = this.apollo.watchQuery<GetUsersResponse>({ query: GET_USERS }).valueChanges;
}
