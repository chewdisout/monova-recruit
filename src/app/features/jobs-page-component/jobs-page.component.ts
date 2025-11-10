import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Job } from '../../models/user';
import { JobService } from '../../services/job/job.service';

@Component({
  standalone: true,
  selector: 'app-jobs-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './jobs-page.component.html',
  styleUrls: ['./jobs-page.component.scss'],
})
export class JobsPageComponent {
  private jobService = inject(JobService);
  private route = inject(ActivatedRoute);

  jobs = signal<Job[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const country = params['country'] || '';
      this.fetchJobs(country);
    });
  }

  fetchJobs(country?: string) {
    this.loading.set(true);
    this.error.set('');
    this.jobService.getJobs(country).subscribe({
      next: (data) => {
        this.jobs.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load jobs.');
        this.loading.set(false);
      }
    });
  }
}
