import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { AsyncPipe } from '@angular/common';
import { switchMap } from 'rxjs';

const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      username
      age
      nationality
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      name
      username
      age
      nationality
    }
  }
`;

const GET_NATIONALITIES = gql`
  query GetNationalities {
    nationalities
  }
`;

interface User {
  id: string;
  name: string;
  username: string;
  age: number;
  nationality: string;
}

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AsyncPipe],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css',
})
export class EditUserComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly apollo = inject(Apollo);
  private readonly fb = inject(FormBuilder);

  nationalities$ = this.apollo
    .watchQuery<{ nationalities: string[] }>({ query: GET_NATIONALITIES })
    .valueChanges;

  userForm = this.fb.group({
    name: ['', Validators.required],
    username: ['', Validators.required],
    age: [0, [Validators.required, Validators.min(1), Validators.max(150)]],
    nationality: ['', Validators.required],
  });

  result$ = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('id') ?? '';
      return this.apollo.watchQuery<{ user: User }>({
        query: GET_USER,
        variables: { id },
      }).valueChanges;
    })
  );

  ngOnInit() {
    this.result$.subscribe(({ data }) => {
      if (data?.user) {
        const user = data.user;
        this.userForm.patchValue({
          name: user.name,
          username: user.username,
          age: user.age,
          nationality: user.nationality,
        });
      }
    });
  }

  onSubmit() {
    if (this.userForm.invalid) return;
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    const input = this.userForm.getRawValue();
    this.apollo
      .mutate({
        mutation: UPDATE_USER,
        variables: { id, input },
      })
      .subscribe({
        next: () => this.router.navigate(['/users']),
        error: (err) => console.error(err),
      });
  }
}
