import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home-page-component/home-page-component';

export const routes: Routes = [
    { path: '', component: HomePageComponent},
    { path: '**', redirectTo: '' } 
];
