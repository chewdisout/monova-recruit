import { Component, OnInit, inject, signal } from '@angular/core';
import { AdminCompany } from '../../../models/admin';
import { AdminApiService } from '../../../services/admin/admin-api.service';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-admin-companies-list',
  templateUrl: './admin-companies-list.component.html',
  styleUrls: ['./admin-companies-list.component.scss'],
  imports: [RouterLink, NgClass],
})
export class AdminCompaniesListComponent implements OnInit {
  private api = inject(AdminApiService);

  companies = signal<AdminCompany[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.api.getCompanies().subscribe({
      next: (data) => {
        this.companies.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Failed to load companies');
        this.loading.set(false);
      },
    });
  }
}
