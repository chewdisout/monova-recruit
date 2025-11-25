import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import { AdminApiService } from '../../../services/admin/admin-api.service';

import {
  AdminCompany,
  AdminCompanyUpdate,
  AdminCompanyCreate,
  AdminCompanyJob,
  AdminPlacementDetailed,
  AdminPlacementCreate,
  AdminUser
} from '../../../models/admin';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-company-detail',
  templateUrl: './admin-company-detail.component.html',
  styleUrls: ['./admin-company-detail.component.scss'],
  imports: [DatePipe, ReactiveFormsModule],
})
export class AdminCompanyDetailComponent implements OnInit {
  private api = inject(AdminApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  companyId = signal<number | null>(null);
  isNew = signal<boolean>(false);

  company = signal<AdminCompany | null>(null);
  jobs = signal<AdminCompanyJob[]>([]);
  placements = signal<AdminPlacementDetailed[]>([]);

  loading = signal<boolean>(true);
  saving = signal<boolean>(false);
  deleting = signal<boolean>(false);
  error = signal<string | null>(null);

  candidates = signal<AdminUser[]>([]);
  candidatesLoading = signal<boolean>(false);
  assigning = signal<boolean>(false);

  form = this.fb.group({
    name: ['', Validators.required],
    hr_contact_name: [''],
    hr_contact_email: [''],
    hr_contact_phone: [''],
    country: [''],
    city: [''],
    address: [''],
    status: ['active'],
    notes: [''],
  });

  assignForm = this.fb.group({
    candidateId: [null, Validators.required],
  });

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');

    if (param === 'new') {
      this.isNew.set(true);
      this.loading.set(false);
      return;
    }

    const id = Number(param);
    if (Number.isNaN(id)) {
      this.error.set('Invalid company id');
      this.loading.set(false);
      return;
    }

    this.companyId.set(id);
    this.loadCompany(id);
    this.loadJobs(id);
    this.loadPlacements(id);
    this.loadCandidates(); 
  }

  private loadCompany(id: number) {
    this.loading.set(true);
    this.error.set(null);

    this.api.getCompany(id).subscribe({
      next: (c) => {
        this.company.set(c);
        this.form.patchValue({
          name: c.name,
          hr_contact_name: c.hr_contact_name || '',
          hr_contact_email: c.hr_contact_email || '',
          hr_contact_phone: c.hr_contact_phone || '',
          country: c.country || '',
          city: c.city || '',
          address: c.address || '',
          status: c.status || 'active',
          notes: c.notes || '',
        });
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Failed to load company.');
        this.loading.set(false);
      },
    });
  }

  private loadJobs(companyId: number) {
    this.api.getCompanyJobs(companyId).subscribe({
      next: (rows) => this.jobs.set(rows),
      error: (err) => console.error('Failed to load company jobs', err),
    });
  }

  private loadPlacements(companyId: number) {
    this.api.getCompanyPlacements(companyId).subscribe({
      next: (rows) => this.placements.set(rows),
      error: (err) => console.error('Failed to load placements', err),
    });
  }

  save() {
    if (this.form.invalid) return;

    this.saving.set(true);
    this.error.set(null);

    const payload: AdminCompanyUpdate | AdminCompanyCreate = this.form.value;

    if (this.isNew()) {
      // create
      this.api.createCompany(payload as AdminCompanyCreate).subscribe({
        next: (created) => {
          this.saving.set(false);
          this.router.navigate(['/admin/companies', created.id]);
        },
        error: (err) => {
          console.error(err);
          this.error.set('Failed to create company.');
          this.saving.set(false);
        },
      });
    } else {
      const id = this.companyId();
      if (!id) return;

      this.api.updateCompany(id, payload as AdminCompanyUpdate).subscribe({
        next: (updated) => {
          this.company.set(updated);
          this.saving.set(false);
        },
        error: (err) => {
          console.error(err);
          this.error.set('Failed to update company.');
          this.saving.set(false);
        },
      });
    }
  }

  deleteCompany() {
    const id = this.companyId();
    if (!id || this.deleting()) return;

    if (!confirm('Delete this company? This cannot be undone.')) return;

    this.deleting.set(true);
    this.error.set(null);

    this.api.deleteCompany(id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.router.navigate(['/admin/companies']);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Failed to delete company.');
        this.deleting.set(false);
      },
    });
  }

  private loadCandidates() {
    this.candidatesLoading.set(true);

    this.api.getUsers().subscribe({
      next: (users) => {
        this.candidates.set(users.filter(u => u.candidateId));
        this.candidatesLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.candidatesLoading.set(false);
      },
    });
  }

    assignCandidateToCompany() {
        if (this.assignForm.invalid) return;

        const companyId = this.companyId();
        const candidateId = this.assignForm.value.candidateId;

        if (!companyId || !candidateId) return;

        this.assigning.set(true);
        this.error.set(null);

        const payload: AdminPlacementCreate = {
            candidate_id: candidateId,
            status: 'placed',
        };

        this.api.createPlacementForCompany(companyId, payload).subscribe({
        next: () => {
            this.assigning.set(false);
            this.assignForm.reset();
            this.loadPlacements(companyId); // обновляем список
        },
        error: (err) => {
            console.error(err);
            this.error.set('Failed to assign candidate to company.');
            this.assigning.set(false);
        },
        });
    }
}
