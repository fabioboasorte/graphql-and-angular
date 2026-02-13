import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { AsyncPipe } from '@angular/common';

const ADD_USER = gql`
  mutation AddUser($input: AddUserInput!) {
    addUser(input: $input) {
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

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AsyncPipe],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css',
})
export class AddUserComponent {
  private router = inject(Router);
  private apollo = inject(Apollo);
  private fb = inject(FormBuilder);

  nationalities$ = this.apollo
    .watchQuery<{ nationalities: string[] }>({ query: GET_NATIONALITIES })
    .valueChanges;

  userForm = this.fb.group({
    name: ['', Validators.required],
    username: ['', Validators.required],
    age: [0, [Validators.required, Validators.min(1), Validators.max(150)]],
    nationality: ['', Validators.required],
    customNationality: [''],
  });

  errorMessage = '';
  showCustomNationality = false;

  onNationalityChange(value: string) {
    this.showCustomNationality = value === '__other__';
  }

  get isFormValid(): boolean {
    const raw = this.userForm.getRawValue();
    const nationality = raw.nationality === '__other__' ? raw.customNationality?.trim() : raw.nationality;
    const baseValid = this.userForm.get('name')?.valid && this.userForm.get('username')?.valid && this.userForm.get('age')?.valid;
    return !!(baseValid && nationality);
  }

  onSubmit() {
    const raw = this.userForm.getRawValue();
    const nationality = raw.nationality === '__other__' ? raw.customNationality?.trim() : raw.nationality;
    if (!nationality || !this.isFormValid) return;
    this.errorMessage = '';
    const input = {
      name: raw.name,
      username: raw.username,
      age: raw.age,
      nationality,
    };
    this.apollo
      .mutate({
        mutation: ADD_USER,
        variables: { input },
      })
      .subscribe({
        next: () => this.router.navigate(['/users']),
        error: (err) => {
          this.errorMessage = err.message;
        },
      });
  }
}
