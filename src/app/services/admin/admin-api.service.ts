import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { 
    JobTranslationUpsert,
    JobTranslation,
    AdminApplicationJob,
    AdminJob,
    AdminJobCreate,
    AdminJobUpdate,
    AdminUser,
    AdminUserUpdate
} from '../../models/admin'

@Injectable({ providedIn: 'root' })
export class AdminApiService {
    private http = inject(HttpClient);
    private apiBase = environment.apiBase;

    // --- Users ---

    getUsers() {
        return this.http.get<AdminUser[]>(`${this.apiBase}/admin/users`);
    }

    getUser(id: number) {
        return this.http.get<AdminUser>(`${this.apiBase}/admin/users/${id}`);
    }

    updateUser(id: number, payload: AdminUserUpdate) {
        return this.http.patch<AdminUser>(`${this.apiBase}/admin/users/${id}`, payload);
    }

    getUserApplications(id: number) {
        return this.http.get<AdminApplicationJob[]>(
        `${this.apiBase}/admin/users/${id}/applications`
        );
    }

    // --- Jobs ---

    getJobs() {
        return this.http.get<AdminJob[]>(`${this.apiBase}/admin/jobs`);
    }

    getJob(id: number) {
        return this.http.get<AdminJob>(`${this.apiBase}/admin/jobs/${id}`);
    }

    createJob(payload: AdminJobCreate) {
        return this.http.post<AdminJob>(`${this.apiBase}/admin/jobs`, payload);
    }

    updateJob(id: number, payload: AdminJobUpdate) {
        return this.http.put<AdminJob>(`${this.apiBase}/admin/jobs/${id}`, payload);
    }

    // --- Translations ---

    getJobTranslations(jobId: number) {
        return this.http.get<JobTranslation[]>(
            `${this.apiBase}/admin/jobs/${jobId}/translations`
        );
    }

    upsertJobTranslation(jobId: number, lang: string, payload: JobTranslationUpsert) {
        return this.http.put(
            `${this.apiBase}/admin/jobs/${jobId}/translations/${lang}`,
            payload
        );
    }
}
