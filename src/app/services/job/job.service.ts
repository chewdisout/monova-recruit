import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Job } from '../../models/user';

@Injectable({ providedIn: 'root' })
export class JobService {
  private http = inject(HttpClient);
  private apiBase = environment.apiBase;

  getJobs(country?: string): Observable<Job[]> {
    let url = `${this.apiBase}/jobs`;
    if (country) url += `?country=${country}`;
    return this.http.get<Job[]>(url);
  }

  getJob(id: number): Observable<Job> {
    return this.http.get<Job>(`${this.apiBase}/jobs/${id}`);
  }
}
