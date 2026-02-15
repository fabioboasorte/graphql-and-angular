import { Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Apollo } from 'apollo-angular';
import { GET_DATA } from '../graphql';

@Component({
  selector: 'app-graphql-demo',
  imports: [AsyncPipe, JsonPipe],
  templateUrl: './graphql-demo.component.html',
  styleUrl: './graphql-demo.component.css',
})
export class GraphqlDemoComponent {
  private readonly apollo = inject(Apollo);

  result$ = this.apollo.watchQuery({ query: GET_DATA }).valueChanges;
}
