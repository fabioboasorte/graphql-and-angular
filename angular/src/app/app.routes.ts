import { Routes } from '@angular/router';
import { UsersComponent } from './pages/users/users.component';
import { DataComponent } from './pages/data/data.component';
import { EditUserComponent } from './pages/edit-user/edit-user.component';
import { AddUserComponent } from './pages/add-user/add-user.component';

export const routes: Routes = [
  { path: 'users', component: UsersComponent },
  { path: 'users/new', component: AddUserComponent },
  { path: 'users/:id/edit', component: EditUserComponent },
  { path: 'data', component: DataComponent },
  { path: '', redirectTo: '/users', pathMatch: 'full' },
];
