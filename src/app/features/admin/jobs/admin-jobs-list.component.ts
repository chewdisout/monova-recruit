import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminApiService } from '../../../services/admin/admin-api.service';
import { AdminJob } from '../../../models/admin';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-jobs-list.component.html',
  styleUrls: ['./admin-jobs-list.component.scss'],
})
export class AdminJobsListComponent implements OnInit {
  private api = inject(AdminApiService);

  jobs = signal<AdminJob[]>([]);
  loading = signal(true);
  deletingId = signal<number | null>(null);
  error = signal('');

  ngOnInit() {
    this.loadJobs();
  }

  private loadJobs() {
    this.loading.set(true);
    this.error.set('');

    this.api.getJobs().subscribe({
      next: jobs => {
        this.jobs.set(jobs);
        this.loading.set(false);
      },
      error: () => {
        this.jobs.set([]);
        this.loading.set(false);
        this.error.set('Failed to load jobs.');
      },
    });
  }

  onDelete(job: AdminJob) {
    const confirmed = window.confirm(
      `Delete job "${job.title}" and all related applications/translations?`
    );
    if (!confirmed) return;

    this.deletingId.set(job.id);
    this.error.set('');

    this.api.deleteJob(job.id).subscribe({
      next: () => {
        // remove from UI
        this.jobs.update(list => list.filter(j => j.id !== job.id));
        this.deletingId.set(null);
      },
      error: () => {
        this.deletingId.set(null);
        this.error.set('Failed to delete job. Please try again.');
      },
    });
  }
}
