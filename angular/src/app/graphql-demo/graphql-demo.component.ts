import { Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Apollo, gql } from 'apollo-angular';

/** Replace with your API's query. Example: query { users { id name } } */
const GET_DATA = gql`
  query {
    __typename
  }
`;

@Component({
  selector: 'app-graphql-demo',
  imports: [AsyncPipe, JsonPipe],
  templateUrl: './graphql-demo.component.html',
  styleUrl: './graphql-demo.component.css',
})
export class GraphqlDemoComponent {
  private apollo = inject(Apollo);

  result$ = this.apollo.watchQuery({ query: GET_DATA }).valueChanges;
}
