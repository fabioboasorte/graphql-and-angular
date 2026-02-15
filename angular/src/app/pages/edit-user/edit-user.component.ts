import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { AsyncPipe } from '@angular/common';
import { switchMap } from 'rxjs';
import { User } from '../../models';
import { GET_USER, GET_NATIONALITIES, UPDATE_USER } from '../../graphql';

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
    street: [''],
    city: [''],
    state: [''],
    zip: [''],
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
        const addr = user.address;
        this.userForm.patchValue({
          name: user.name,
          username: user.username,
          age: user.age,
          nationality: user.nationality,
          street: addr?.street ?? '',
          city: addr?.city ?? '',
          state: addr?.state ?? '',
          zip: addr?.zip ?? '',
        });
      }
    });
  }

  onSubmit() {
    if (this.userForm.invalid) return;
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    const raw = this.userForm.getRawValue();
    const input = {
      name: raw.name,
      username: raw.username,
      age: raw.age,
      nationality: raw.nationality,
      address: {
        street: raw.street,
        city: raw.city,
        state: raw.state,
        zip: raw.zip,
      },
    };
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
