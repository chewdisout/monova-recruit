// src/app/services/auth/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.services';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, take, map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const token = auth.getToken();

    // 1) No token at all -> straight to login
    if (!token) {
        return router.createUrlTree(['/auth/login'], {
        queryParams: { redirectTo: state.url },
        });
    }

    // 2) Already authenticated in memory -> allow immediately
    if (auth.isAuthenticated()) {
        return true;
    }

    // 3) Token exists but no user yet:
    auth.loadUserMeta(token);

    return toObservable(auth.currentUser).pipe(
        filter(user => !!user || !auth.getToken()),
        take(1),
        map(user => {
        if (user) {
            return true;
        }
        return router.createUrlTree(['/auth/login'], {
            queryParams: { redirectTo: state.url },
        });
        })
    );
};

function isAdminFromToken(token: string | null): boolean {
    if (!token) return false;

    try {
        const [, payloadB64] = token.split('.');
        const payloadJson = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
        const payload = JSON.parse(payloadJson);

        if (payload.role === 'admin') {
            return true;
        }

        return false;
    } catch {
        return false;
    }
}

export const adminGuard: CanActivateFn = (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const user = auth.currentUser();

    // 1) If currentUser already loaded and admin → allow
    if (user?.isAdmin) {
        return true;
    }

    // 2) Fallback: check JWT payload directly
    const token = auth.getToken();
    if (isAdminFromToken(token)) {
        return true;
    }

    // 3) Not admin → redirect
    router.navigate(['/auth/login'], {
        queryParams: { redirectTo: state.url },
    });
    return false;
};