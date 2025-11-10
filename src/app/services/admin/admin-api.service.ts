import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface AdminUser {
  userId: number;
  userEmail: string;
  userName?: string | null;
  userSurname?: string | null;
  userPhoneNumber?: string | null;
  userCitizenship?: string | null;
  userEmploymentStatus?: string | null;
  is_admin: boolean;
}

export interface AdminUserUpdate {
  userName?: string | null;
  userSurname?: string | null;
  userPhoneNumber?: string | null;
  userCitizenship?: string | null;
  userEmploymentStatus?: string | null;
  is_admin?: boolean;
}

export interface AdminApplicationJob {
  id: number;
  status: string;
  created_at: string;
  job_id: number;
  job_title?: string | null;
  job_country?: string | null;
}

export interface AdminJob {
  id: number;
  title: string;
  country: string;
  city?: string | null;
  category?: string | null;
  short_description?: string | null;
  full_description?: string | null;
  is_active: boolean;
}

export interface AdminJobCreate {
  title: string;
  country: string;
  city?: string | null;
  category?: string | null;
  short_description?: string | null;
  full_description?: string | null;
  is_active?: boolean;
}

export interface AdminJobUpdate extends Partial<AdminJobCreate> {
  is_active?: boolean;
}

export interface JobTranslationUpsert {
  lang_code: string;
  title?: string | null;
  short_description?: string | null;
  full_description?: string | null;
  responsibilities?: string | null;
  requirements_text?: string | null;
  benefits_text?: string | null;
  housing_details?: string | null;
  documents_required?: string | null;
  bonuses?: string | null;
  language_required?: string | null;
}

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

  upsertJobTranslation(jobId: number, lang: string, payload: JobTranslationUpsert) {
    return this.http.put(
      `${this.apiBase}/admin/jobs/${jobId}/translations/${lang}`,
      payload
    );
  }
}
