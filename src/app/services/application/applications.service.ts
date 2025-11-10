import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.services';

export interface Application {
  id: number;
  job_id: number;
  status: string;
  created_at: string;
}

export interface ApplicationWithJob {
  id: number;
  status: string;
  created_at: string;
  job: {
    id: number;
    title: string;
    country: string;
    city?: string | null;
    category: string;
  };
}

@Injectable({ providedIn: 'root' })
export class ApplicationsService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private apiBase = environment.apiBase;

  private getAuthHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders(
      token ? { Authorization: `Bearer ${token}` } : {}
    );
  }

  apply(jobId: number): Observable<Application> {
    return this.http.post<Application>(
      `${this.apiBase}/applications`,
      { job_id: jobId },
      { headers: this.getAuthHeaders() }
    );
  }

  getMyApplications(): Observable<ApplicationWithJob[]> {
    return this.http.get<ApplicationWithJob[]>(
      `${this.apiBase}/applications/me`,
      { headers: this.getAuthHeaders() }
    );
  }
}
