// src/app/services/auth/auth.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

const TOKEN_KEY = 'mnv_token';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Read token directly; no AuthService here (avoids circular dep)
  let token: string | null = null;

  if (typeof window !== 'undefined') {
    token = localStorage.getItem(TOKEN_KEY);
  }

  if (token && !req.headers.has('Authorization')) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if ((error.status === 401 || error.status === 403) && typeof window !== 'undefined') {
        // Backend says token is invalid → clear it.
        localStorage.removeItem(TOKEN_KEY);
        // Don't reload automatically; let AuthService state fall back on next usage.
      }
      return throwError(() => error);
    })
  );
};
