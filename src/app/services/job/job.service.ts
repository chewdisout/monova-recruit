import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Job } from '../../models/user';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class JobService {
  private http = inject(HttpClient);
  private translate = inject(TranslateService);
  private apiBase = environment.apiBase;

  private getLang(): string {
    const lang =
      this.translate.currentLang ||
      this.translate.getBrowserLang() ||
      'en';
    return lang.toLowerCase();
  }


  getJobs(country?: string): Observable<Job[]> {
    const params: any = { lang: this.getLang() };
    if (country) params.country = country;
    return this.http.get<Job[]>(`${this.apiBase}/jobs`, { params });
  }

  getJobsByCategory(category?: string): Observable<Job[]> {
    const params: any = { lang: this.getLang() };
    if (category) params.country = category;
    return this.http.get<Job[]>(`${this.apiBase}/jobsByCategory`, { params });
  }

  getJob(id: number): Observable<Job> {
    const params = { lang: this.getLang() };
    return this.http.get<Job>(`${this.apiBase}/jobs/${id}`, { params });
  }
}
