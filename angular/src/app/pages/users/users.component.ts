import { Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { GetUsersResponse } from '../../models';
import { GET_USERS } from '../../graphql';

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
