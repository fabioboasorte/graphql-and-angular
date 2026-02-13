import { ApplicationConfig, provideZoneChangeDetection, inject } from '@angular/core';
import { provideHttpClient, HttpHeaders } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

import { routes } from './app.routes';

function createApollo() {
  const httpLink = inject(HttpLink);
  return {
    link: httpLink.create({
      uri: 'http://localhost:3000',
      headers: new HttpHeaders({
        'Apollo-Require-Preflight': 'true',
      }),
    }),
    cache: new InMemoryCache(),
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes),
    provideApollo(createApollo),
  ],
};
