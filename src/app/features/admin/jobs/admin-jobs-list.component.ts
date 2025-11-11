import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminApiService } from '../../../services/admin/admin-api.service';
import { AdminJob } from '../../../models/admin';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-jobs-list.component.html',
  styleUrls: [],
})
export class AdminJobsListComponent implements OnInit {
  private api = inject(AdminApiService);

  jobs = signal<AdminJob[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.api.getJobs().subscribe({
      next: jobs => {
        this.jobs.set(jobs);
        this.loading.set(false);
      },
      error: () => {
        this.jobs.set([]);
        this.loading.set(false);
      },
    });
  }
}
