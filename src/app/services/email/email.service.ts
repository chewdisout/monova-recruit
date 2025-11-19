import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { EmailContact } from '../../models/email';

@Injectable({ providedIn: 'root' })
export class EmailService {
    private http = inject(HttpClient);
    private apiBase = environment.apiBase;

    postEmailContact(payload: EmailContact) {
        return this.http.post<EmailContact>(`${this.apiBase}/email/add`, payload);
    }
}