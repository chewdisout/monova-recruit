import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { JobService } from '../../services/job/job.service';
import { Job } from '../../models/user';
import { ApplicationsService, ApplicationWithJob } from '../../services/application/applications.service';
import { AuthService } from '../../services/auth/auth.services';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-job-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss'],
})
export class JobDetailsComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);
  private apps = inject(ApplicationsService);
  private jobsService = inject(JobService);

  job = signal<Job | null>(null);
  loading = signal(true);
  error = signal('');
  applying = signal(false);
  hasApplied = signal(false);
  applyMessage = signal('');

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.jobsService.getJob(id).subscribe({
      next: (job) => {
        this.job.set(job);
        this.loading.set(false);

        if (this.auth.isAuthenticated()) {
          this.apps.getMyApplications().subscribe({
            next: (apps: ApplicationWithJob[]) => {
              const applied = apps.some(a =>
                (a.job && a.job.id === job.id) ||
                (a as any).job_id === job.id // fallback if backend returns plain Application
              );
              this.hasApplied.set(applied);
            },
            error: () => {
              // ignore, keep hasApplied = false
            },
          });
        }
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Job not found.');
      },
    });
  }

  onApply() {
    const job = this.job();
    if (!job) return;

    // Not logged in → go login, then back here
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/auth/login'], {
        queryParams: { redirectTo: `/jobs/${job.id}` },
      });
      return;
    }

    if (this.hasApplied()) {
      this.applyMessage.set('You have already applied for this job.');
      return;
    }

    this.applying.set(true);
    this.applyMessage.set('');

    this.apps.apply(job.id).subscribe({
      next: () => {
        this.applying.set(false);
        this.hasApplied.set(true);
        this.applyMessage.set('Application submitted successfully.');
      },
      error: (err) => {
        this.applying.set(false);
        const msg = err?.error?.detail || 'Could not submit application. Please try again.';
        this.applyMessage.set(msg);

        // if backend says already applied, sync UI
        if (msg.toLowerCase().includes('already')) {
          this.hasApplied.set(true);
        }
      },
    });
  }
}
