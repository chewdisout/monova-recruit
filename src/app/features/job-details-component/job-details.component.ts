import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { JobService } from '../../services/job/job.service';
import { Job } from '../../models/user';
import { ApplicationsService, ApplicationWithJob } from '../../services/application/applications.service';
import { AuthService } from '../../services/auth/auth.services';

@Component({
  standalone: true,
  selector: 'app-job-details',
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss'],
})
export class JobDetailsComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private auth = inject(AuthService);
  private apps = inject(ApplicationsService);
  private jobsService = inject(JobService);

  job = signal<Job | null>(null);
  loading = signal(true);
  error = signal('');
  applying = signal(false);
  hasApplied = signal(false);
  applyMessage = signal('');

  // modal visibility
  showApplyModal = signal(false);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.jobsService.getJob(id).subscribe({
      next: (job) => {
        this.job.set(job);
        this.loading.set(false);

        if (this.auth.isAuthenticated()) {
          this.apps.getMyApplications().subscribe({
            next: (apps: ApplicationWithJob[]) => {
              const applied = apps.some(
                (a) =>
                  (a.job && a.job.id === job.id) ||
                  (a as any).job_id === job.id
              );
              this.hasApplied.set(applied);
            },
            error: () => {
              // ignore, keep default false
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

  /** Click handler from UI */
  onApply() {
    const job = this.job();
    if (!job) return;

    if (!this.auth.isAuthenticated()) {
      // not logged in -> open modal instead of auto-redirect
      this.showApplyModal.set(true);
      return;
    }

    // logged in -> run normal apply flow
    this.performApply(job.id);
  }

  /** Actual apply logic for authenticated users */
  private performApply(jobId: number) {
    if (this.hasApplied()) {
      this.applyMessage.set('You have already applied for this job.');
      return;
    }

    this.applying.set(true);
    this.applyMessage.set('');

    this.apps.apply(jobId).subscribe({
      next: () => {
        this.applying.set(false);
        this.hasApplied.set(true);
        this.applyMessage.set('Application submitted successfully.');
      },
      error: (err) => {
        this.applying.set(false);
        const msg =
          err?.error?.detail ||
          'Could not submit application. Please try again.';
        this.applyMessage.set(msg);

        if (msg.toLowerCase().includes('already')) {
          this.hasApplied.set(true);
        }
      },
    });
  }

  /* Modal actions */

  closeApplyModal() {
    this.showApplyModal.set(false);
  }

  goToSignup() {
    const job = this.job();
    this.showApplyModal.set(false);

    // send them to registration/login with redirect back to this job
    this.router.navigate(['/auth/register'], {
      queryParams: job ? { redirectTo: `/jobs/${job.id}` } : {},
    });
  }

  goToContact() {
    this.showApplyModal.set(false);
    // either navigate to contact page, or leave tel/mail links in modal
    this.router.navigate(['/contact']);
  }

  /* Helpers */

  resolveLabel(value: string, prefix: string): string {
    if (!value) return '';

    // if already full key
    if (value.startsWith(prefix)) {
      return this.translate.instant(value);
    }

    const normalized = value.toUpperCase().replace(/\s|-/g, '');
    const key = `${prefix}${normalized}`;
    const translated = this.translate.instant(key);

    return translated === key ? value : translated;
  }

  getJobImageUrl(image?: string | null): string {
    if (!image) {
      return 'assets/images/job-default.jpg';
    }
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    return `assets/job-images/${image}`;
  }
}
