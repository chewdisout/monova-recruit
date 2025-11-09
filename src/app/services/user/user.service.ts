import { inject, Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.services';
import { UserOut, UserExperience, ProfileUpdatePayload } from '../../models/user';
import { catchError, throwError, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
    private http = inject(HttpClient);
    private auth = inject(AuthService);
    private apiBase = environment.apiBase;

    private _user = signal<UserOut | null>(null);
    private _loading = signal(false);
    private _error = signal<string | null>(null);

    private _experiences = signal<UserExperience[]>([]);
    private _expLoading = signal(false);
    private _expError = signal<string | null>(null);

    readonly user = computed(() => this._user());
    readonly loading = computed(() => this._loading());
    readonly error = computed(() => this._error());

    experiences = computed(() => this._experiences());
    expLoading = computed(() => this._expLoading());
    expError = computed(() => this._expError());

    loadProfile() {
        const token = this.auth.getToken ? this.auth.getToken() : localStorage.getItem('mnv_token');

        if (!token) {
            this._user.set(null);
            return;
        }

        this._loading.set(true);
        this._error.set(null);

        const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        });

        this.http
        .get<UserOut>(`${this.apiBase}/loadProfileData`, { headers })
        .pipe(
            catchError((err: HttpErrorResponse) => {
                console.error('Profile load error', err);

                if (err.status === 401 || err.status === 403) {
                    if (this.auth.logout) this.auth.logout();
                    this._user.set(null);
                } else {
                    this._error.set('Failed to load profile.');
                }

                return throwError(() => err);
            })
        )
        .subscribe({
            next: (u) => {
                console.log(u);
                this._loading.set(false);
                this._user.set(u);
            },
            error: () => {
                this._loading.set(false);
            },
        });
    }

    hasProfile(): boolean {
        return !!this._user();
    }

    private authHeaders() {
        const token =
        this.auth.getToken?.() ?? localStorage.getItem('mnv_token');
        return token
        ? {
            headers: new HttpHeaders({
                Authorization: `Bearer ${token}`,
            }),
            }
        : {};
    }

    loadExperiences() {
        const headers = this.authHeaders();
        if (!('headers' in headers)) {
        this._experiences.set([]);
        return;
        }

        this._expLoading.set(true);
        this._expError.set(null);

        this.http
        .get<UserExperience[]>(`${this.apiBase}/profile/experience`, headers)
        .subscribe({
            next: (list) => {
                this._expLoading.set(false);
                this._experiences.set(list);
            },
            error: (err) => {
                this._expLoading.set(false);
                console.error('Failed to load experiences', err);
                this._expError.set('Failed to load work experience.');
            },
        });
    }

    addExperience(text: string) {
        const trimmed = text.trim();
        if (!trimmed) return;

        const headers = this.authHeaders();
        if (!('headers' in headers)) return;

        this.http
        .post<UserExperience>(
            `${this.apiBase}/profile/experience`,
            { userExperience: trimmed },
            headers
        )
        .subscribe({
            next: (exp) => {
                this._experiences.update((list) => [...list, exp]);
            },
            error: (err) => {
                console.error('Failed to add experience', err);
            },
        });
    }

    removeExperience(id: number) {
        const headers = this.authHeaders();
        if (!('headers' in headers)) return;

        this.http
        .delete(`${this.apiBase}/profile/experience/${id}`, headers)
        .subscribe({
            next: () => {
                this._experiences.update((list) =>
                    list.filter((e) => e.UserExperienceId !== id)
            );
            },
            error: (err) => {
                console.error('Failed to delete experience', err);
            },
        });
    }

    updateProfile(data: ProfileUpdatePayload) {
    const headers = this.authHeaders();
    if (!('headers' in headers)) {
      return throwError(() => new Error('Not authenticated'));
    }

    return this.http
      .put<UserOut>(`${this.apiBase}/profile`, data, headers)
      .pipe(
        tap((u) => {
          this._user.set(u);
        }),
        catchError((err) => {
          console.error('Update profile failed', err);
          const msg =
            err?.error?.detail || 'Failed to save profile. Please try again.';
          return throwError(() => new Error(msg));
        })
      );
  }
}
