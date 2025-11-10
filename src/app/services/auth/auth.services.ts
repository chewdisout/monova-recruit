import { inject, Injectable, computed, signal, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { tap, catchError } from 'rxjs/operators';
import { UserOut, UserProfile, SignUpPayload, LoginResponse } from '../../models/user';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private platformId = inject(PLATFORM_ID);
    private isBrowser = isPlatformBrowser(this.platformId);

    private apiBase = environment.apiBase;

    private tokenKey = 'mnv_token';

    private _currentUser = signal<UserProfile | null>(null);
    readonly currentUser = computed(() => this._currentUser());
    readonly isLoggedIn = computed(() => !!this._currentUser());

    constructor() {
        if (this.isBrowser) {
            const token = this.getToken();
            if (token) this.loadUserMeta(token);
        }
    }

    isAuthenticated(): boolean {
        if (!this.isBrowser) return false;
        return this.isLoggedIn();
    }

    register(payload: SignUpPayload) {
        return this.http.post<UserOut>(`${this.apiBase}/createUser`, payload).pipe(
            tap(user => {
                console.log('User created', user);
            })
        );
    }

    login(email: string, password: string) {
        return this.http
            .post<LoginResponse>(`${this.apiBase}/login`, { email, password })
            .pipe(
            tap((res) => {
                this.setToken(res.access_token);
                this.loadUserMeta(res.access_token);
            }),
            catchError(this.handleError('login'))
            );
    }

    logout() {
        localStorage.removeItem(this.tokenKey);
        this._currentUser.set(null);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    private setToken(token: string) {
        localStorage.setItem(this.tokenKey, token);
    }

    private authHeaders(token: string) {
        return {
            headers: new HttpHeaders({
                Authorization: `Bearer ${token}`,
            }),
        };
    }

    loadUserMeta(token?: string) {
        const t = token ?? this.getToken();
        if (!t) return;

        this.http
        .get<UserOut>(`${this.apiBase}/loadUserMeta`, this.authHeaders(t))
        .subscribe({
            next: user => {
                const name =
                    user.userName?.trim() ||
                    user.userSurname?.trim() ||
                    user.userEmail;
                this._currentUser.set({
                    id: user.userId,
                    email: user.userEmail,
                    name,
                    isAdmin: !!user.isAdmin,
                });
            },
            error: (err) => {
                console.error('loadUserMeta failed', err);

                if (err.status === 401 || err.status === 403) {
                    this.logout();
                }
            },
        });
    }

    private handleError(operation = 'operation') {
        return (error: HttpErrorResponse) => {
            console.error(`${operation} failed:`, error);
            let msg = 'An unexpected error occurred.';
            if (error.status === 401) msg = 'Unauthorized.';
            if (error.error?.detail) msg = error.error.detail;
            return throwError(() => new Error(msg));
        };
    }
}
