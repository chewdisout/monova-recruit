import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Job } from '../../models/user';
import { JobService } from '../../services/job/job.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-jobs-page',
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './jobs-page.component.html',
  styleUrls: ['./jobs-page.component.scss'],
})
export class JobsPageComponent {
  private jobService = inject(JobService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  jobs = signal<Job[]>([]);
  loading = signal(true);
  error = signal('');

  currentCountry = signal<string | null>(null);
  currentCategory = signal<string | null>(null);

  // simple static lists – adjust to your real data
  countries = [
    { value: 'DE', label: 'Germany' },
    { value: 'NL', label: 'Netherlands' },
    { value: 'FN', label: 'Finland' },
    { value: 'FR', label: 'France' },
  ];

  categories = [
    { value: 'Shipbuilding', label: 'Shipbuilding' },
    { value: 'Warehouse', label: 'Warehousing & Logistics' },
    { value: 'Construction', label: 'Construction' },
    { value: 'Hospitality', label: 'Hospitality & Services' },
  ];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const country = params['country'] || '';
      const category = params['category'] || '';

      this.currentCountry.set(country || null);
      this.currentCategory.set(category || null);

      this.fetchJobs({ country, category });
    });
  }

  fetchJobs(filters: { country?: string; category?: string }) {
    const { country, category } = filters;

    this.loading.set(true);
    this.error.set('');

    const source$ = category
      ? this.jobService.getJobsByCategory(category)
      : this.jobService.getJobs(country);

    source$.subscribe({
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

  onCountryChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value || null;
    this.currentCountry.set(value);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { country: value, page: null }, // page null if you add pagination later
      queryParamsHandling: 'merge',
    });
  }

  onCategoryChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value || null;
    this.currentCategory.set(value);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: value, page: null },
      queryParamsHandling: 'merge',
    });
  }
}
