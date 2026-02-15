import { Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Apollo } from 'apollo-angular';
import { GetUsersResponse } from '../../models';
import { GET_ALL_DATA } from '../../graphql';

@Component({
  selector: 'app-data',
  imports: [AsyncPipe, JsonPipe],
  templateUrl: './data.component.html',
  styleUrl: './data.component.css',
})
export class DataComponent {
  private apollo = inject(Apollo);

  result$ = this.apollo.watchQuery<GetUsersResponse>({ query: GET_ALL_DATA }).valueChanges;
}
