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
  filteredJobs = signal<Job[]>([]);
  housingFilter = signal<string>('');      // '', 'yes', 'no'
  transportFilter = signal<string>('');    // '', 'yes', 'no'
  shiftFilter = signal<string | null>(null);
  minSalaryFilter = signal<number | null>(null);
  sortOrder = signal<'recent' | 'oldest'>('recent');

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

  shiftTypes = [
    { value: 'day',    label: 'Day shifts' },
    { value: 'night',  label: 'Night shifts' },
    { value: 'rotary', label: 'Rotating shifts' },
  ];

  private lastCountry: string | null = null;
  private lastCategory: string | null = null;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const country = (params['country'] || '') as string;
      const category = (params['category'] || '') as string;
      const housing = (params['housing'] || '') as string;
      const transport = (params['transport'] || '') as string;
      const shift = (params['shift'] || '') as string;
      const minSalaryRaw = params['minSalary'] || '';
      const sort = (params['sort'] || 'recent') as 'recent' | 'oldest';

      const needFetch =
        country !== this.lastCountry ||
        category !== this.lastCategory;

      this.currentCountry.set(country || null);
      this.currentCategory.set(category || null);

      this.housingFilter.set(housing);
      this.transportFilter.set(transport);
      this.shiftFilter.set(shift || null);
      this.sortOrder.set(sort);

      const minSalary = minSalaryRaw ? Number(minSalaryRaw) : null;
      this.minSalaryFilter.set(
        !isNaN(minSalary as number) ? (minSalary as number) : null
      );

      if (needFetch) {
        this.lastCountry = country;
        this.lastCategory = category;
        this.fetchJobs({ country, category });
      } else {
        this.applyFilters();
      }
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
        this.applyFilters();
      },
      error: () => {
        this.error.set('Failed to load jobs.');
        this.loading.set(false);
      }
    });
  }

  applyFilters() {
    let result = [...this.jobs()];

    const housing = this.housingFilter();
    const transport = this.transportFilter();
    const shift = this.shiftFilter();
    const minSalary = this.minSalaryFilter();
    const category = this.currentCategory();
    const sort = this.sortOrder();

    // category (in case backend returns broader set)
    if (category) {
      result = result.filter(job => job.category === category);
    }

    // housing provided
    if (housing === 'yes') {
      result = result.filter(job => job.housing_provided === true);
    } else if (housing === 'no') {
      result = result.filter(job => job.housing_provided === false || job.housing_provided == null);
    }

    // transport provided
    if (transport === 'yes') {
      result = result.filter(job => job.transport_provided === true);
    } else if (transport === 'no') {
      result = result.filter(job => job.transport_provided === false || job.transport_provided == null);
    }

    // shift type
    if (shift) {
      result = result.filter(job => job.shift_type === shift);
    }

    // minimum salary (using salary_from)
    if (minSalary != null) {
      result = result.filter(job =>
        typeof job.salary_from === 'number' &&
        job.salary_from >= minSalary
      );
    }

    // sort by created_at
    result.sort((a, b) => {
      const da = a.created_at ? new Date(a.created_at).getTime() : 0;
      const db = b.created_at ? new Date(b.created_at).getTime() : 0;

      if (sort === 'oldest') {
        return da - db; // oldest first
      }
      return db - da;   // most recent first
    });

    this.filteredJobs.set(result);
  }

    onCountryChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value || null;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { country: value, page: null },
      queryParamsHandling: 'merge',
    });
  }

  onCategoryChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value || null;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: value, page: null },
      queryParamsHandling: 'merge',
    });
  }

  onHousingChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value || '';
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { housing: value || null, page: null },
      queryParamsHandling: 'merge',
    });
  }

  onTransportChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value || '';
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { transport: value || null, page: null },
      queryParamsHandling: 'merge',
    });
  }

  onShiftChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value || '';
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { shift: value || null, page: null },
      queryParamsHandling: 'merge',
    });
  }

  onMinSalaryChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const numeric = value ? Number(value) : null;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        minSalary: numeric != null && !isNaN(numeric) ? numeric : null,
        page: null,
      },
      queryParamsHandling: 'merge',
    });
  }

  onSortChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value as 'recent' | 'oldest';

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { sort: value, page: null },
      queryParamsHandling: 'merge',
    });
  }
}
