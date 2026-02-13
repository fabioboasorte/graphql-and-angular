import { Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Apollo, gql } from 'apollo-angular';

const GET_ALL_DATA = gql`
  query GetAllData {
    users {
      id
      name
      username
      age
      nationality
    }
  }
`;

@Component({
  selector: 'app-data',
  imports: [AsyncPipe, JsonPipe],
  templateUrl: './data.component.html',
  styleUrl: './data.component.css',
})
export class DataComponent {
  private apollo = inject(Apollo);

  result$ = this.apollo.watchQuery({ query: GET_ALL_DATA }).valueChanges;
}
