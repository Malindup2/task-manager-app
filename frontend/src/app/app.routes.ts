import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'tasks', component: TaskListComponent, canActivate: [authGuard] },
  { path: 'tasks/new', component: TaskFormComponent, canActivate: [authGuard] },
  { path: 'tasks/edit/:id', component: TaskFormComponent, canActivate: [authGuard] },
  { path: 'tasks/:id', component: TaskDetailComponent, canActivate: [authGuard] },
];
