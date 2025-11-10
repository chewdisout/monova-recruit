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
  //    - fire loadUserMeta() (it does HTTP + updates signals internally)
  //    - wait until:
  //        a) user becomes non-null  -> allow
  //        b) token disappears (logout on 401) -> redirect
  auth.loadUserMeta(token);

  return toObservable(auth.currentUser).pipe(
    // Wait until either:
    // - we have a user, or
    // - token was cleared (meaning auth failed)
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
