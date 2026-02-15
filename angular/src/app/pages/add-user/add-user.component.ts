import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { AsyncPipe } from '@angular/common';
import { ADD_USER, GET_NATIONALITIES } from '../../graphql';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AsyncPipe],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css',
})
export class AddUserComponent {
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
    customNationality: [''],
    street: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zip: ['', Validators.required],
  });

  errorMessage = '';
  showCustomNationality = false;

  onNationalityChange(value: string) {
    this.showCustomNationality = value === '__other__';
  }

  get isFormValid(): boolean {
    const raw = this.userForm.getRawValue();
    const nationality = raw.nationality === '__other__' ? raw.customNationality?.trim() : raw.nationality;
    const baseValid =
      this.userForm.get('name')?.valid &&
      this.userForm.get('username')?.valid &&
      this.userForm.get('age')?.valid &&
      this.userForm.get('street')?.valid &&
      this.userForm.get('city')?.valid &&
      this.userForm.get('state')?.valid &&
      this.userForm.get('zip')?.valid;
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
      address: {
        street: raw.street!,
        city: raw.city!,
        state: raw.state!,
        zip: raw.zip!,
      },
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
