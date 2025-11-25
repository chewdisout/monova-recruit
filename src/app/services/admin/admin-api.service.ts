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
    AdminUserUpdate,
    AdminCompany,
    AdminCompanyCreate,
    AdminCompanyUpdate,
    AdminCompanyJob,
    AdminCompanyJobCreate,
    AdminCompanyJobUpdate,
    AdminPlacement,
    AdminPlacementDetailed,
    AdminPlacementCreate,
    AdminPlacementUpdate,
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

    deleteUser(id: number) {
        return this.http.delete<void>(`${this.apiBase}/admin/users/${id}`);
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

    deleteJob(id: number) {
        return this.http.delete<void>(`${this.apiBase}/admin/jobs/${id}`);
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

    // --- Companies ---

    getCompanies() {
        return this.http.get<AdminCompany[]>(`${this.apiBase}/admin/companies`);
    }

    getCompany(id: number) {
        return this.http.get<AdminCompany>(`${this.apiBase}/admin/companies/${id}`);
    }

    createCompany(payload: AdminCompanyCreate) {
        return this.http.post<AdminCompany>(`${this.apiBase}/admin/companies`, payload);
    }

    updateCompany(id: number, payload: AdminCompanyUpdate) {
        return this.http.patch<AdminCompany>(
        `${this.apiBase}/admin/companies/${id}`,
        payload
        );
    }

    deleteCompany(id: number) {
        return this.http.delete<void>(`${this.apiBase}/admin/companies/${id}`);
    }


    // --- Company Jobs (client positions) ---

    getCompanyJobs(companyId: number) {
        return this.http.get<AdminCompanyJob[]>(
        `${this.apiBase}/admin/companies/${companyId}/jobs`
        );
    }

    createCompanyJob(companyId: number, payload: AdminCompanyJobCreate) {
        return this.http.post<AdminCompanyJob>(
        `${this.apiBase}/admin/companies/${companyId}/jobs`,
        payload
        );
    }

    updateCompanyJob(jobId: number, payload: AdminCompanyJobUpdate) {
        return this.http.patch<AdminCompanyJob>(
        `${this.apiBase}/admin/company-jobs/${jobId}`,
        payload
        );
    }

    deleteCompanyJob(jobId: number) {
        return this.http.delete<void>(
        `${this.apiBase}/admin/company-jobs/${jobId}`
        );
    }


    // --- Placements ---

    // по кандидату (для вкладки на карточке кандидата)
    getCandidatePlacements(candidateId: number) {
        return this.http.get<AdminPlacementDetailed[]>(
        `${this.apiBase}/admin/candidates/${candidateId}/placements`
        );
    }

    createCandidatePlacement(candidateId: number, payload: AdminPlacementCreate) {
        return this.http.post<AdminPlacement>(
        `${this.apiBase}/admin/candidates/${candidateId}/placements`,
        payload
        );
    }

    updatePlacement(placementId: number, payload: AdminPlacementUpdate) {
        return this.http.patch<AdminPlacement>(
        `${this.apiBase}/admin/placements/${placementId}`,
        payload
        );
    }

    deletePlacement(placementId: number) {
        return this.http.delete<void>(
        `${this.apiBase}/admin/placements/${placementId}`
        );
    }

    // по компании (аналитика по клиенту)
    getCompanyPlacements(companyId: number) {
        return this.http.get<AdminPlacementDetailed[]>(
        `${this.apiBase}/admin/companies/${companyId}/placements`
        );
    }

    createPlacementForCompany(companyId: number, payload: AdminPlacementCreate) {
        return this.http.post<AdminPlacement>(
        `${this.apiBase}/admin/companies/${companyId}/placements`,
        payload
        );
    }
}
