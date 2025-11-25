import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home-page-component/home-page-component';
import { authGuard, adminGuard } from './services/auth/auth.guard';

export const routes: Routes = [
    { path: '', component: HomePageComponent},
    {
        path: 'auth/login',
        loadComponent: () =>
        import('../app/features/auth/login-page/login-page').then(m => m.LoginPageComponent),
    },
    {
        path: 'employers',
        loadComponent: () =>
        import('../app/features/employers-page-component/employers-page.component').then(m => m.EmployersPageComponent),
    },
    {
        path: 'referral',
        loadComponent: () =>
        import('../app/features/referral-page-component/referral-page.component').then(m => m.ReferralPageComponent),
    },
    {
        path: 'terms',
        loadComponent: () =>
        import('../app/features/terms-page-component/terms-page.component').then(m => m.TermsPageComponent),
    },
    {
        path: 'privacy',
        loadComponent: () =>
        import('../app/features/privacy-page-component/privacy-page.component').then(m => m.PrivacyPageComponent),
    },
    {
        path: 'jobs',
        loadComponent: () =>
        import('../app/features/jobs-page-component/jobs-page.component').then(m => m.JobsPageComponent),
    },
    {
        path: 'jobs/:id',
        loadComponent: () =>
        import('../app/features/job-details-component/job-details.component').then(m => m.JobDetailsComponent),
    },
    {
        path: 'faq',
        loadComponent: () =>
        import('../app/features/faq-page-component/faq-page.component').then(m => m.FaqPageComponent),
    },
    {
        path: 'contacts',
        loadComponent: () =>
        import('../app/features/contact-page-component/contact-page.component').then(m => m.ContactPageComponent),
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
    {
        path: 'admin',
        canActivate: [adminGuard],
        loadComponent: () =>
            import('./features/admin/admin-layout.component').then(m => m.AdminLayoutComponent),
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'users' },
            {
                path: 'users',
                loadComponent: () =>
                    import('./features/admin/users/admin-users-list.component')
                    .then(m => m.AdminUsersListComponent),
            },
            {
                path: 'users/:id',
                loadComponent: () =>
                    import('./features/admin/users/admin-user-detail.component')
                    .then(m => m.AdminUserDetailComponent),
            },
            {
                path: 'jobs',
                loadComponent: () =>
                    import('./features/admin/jobs/admin-jobs-list.component')
                    .then(m => m.AdminJobsListComponent),
            },
            {
                path: 'jobs/:id',
                loadComponent: () =>
                    import('./features/admin/jobs/admin-job-edit.component')
                    .then(m => m.AdminJobEditComponent),
            },
            {
                path: 'jobs/new',
                loadComponent: () =>
                    import('./features/admin/jobs/admin-job-edit.component')
                    .then(m => m.AdminJobEditComponent),
            },
            {
                path: 'companies',
                loadComponent: () =>
                    import('./features/admin/companies/admin-companies-list.component')
                    .then(m => m.AdminCompaniesListComponent),
            },
            {
                path: 'companies/:id',
                loadComponent: () =>
                    import('./features/admin/companies/admin-company-detail.component')
                    .then(m => m.AdminCompanyDetailComponent),
            },
        ],
    },
    { path: '**', redirectTo: '', pathMatch: 'full' } 
];
