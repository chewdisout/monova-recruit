import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home-page-component/home-page-component';

export const routes: Routes = [
    { path: '', component: HomePageComponent},
    {
        path: 'auth/login',
        loadComponent: () =>
        import('../app/features/auth/login-page/login-page').then(m => m.LoginPageComponent),
    },
    {
        path: 'auth/register',
        loadComponent: () =>
        import('../app/features/auth/register-page/register-page').then(m => m.RegisterPageComponent),
    },
    { path: '**', redirectTo: '' } 
];
