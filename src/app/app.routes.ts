import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home-page-component/home-page-component';
import { authGuard } from './services/auth/auth.guard';

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
    {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () =>
        import('../app/features/profile-page-component/profile-page-component').then(m => m.ProfilePageComponent),
    },
    { path: '**', redirectTo: '', pathMatch: 'full' } 
];
