import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

import {
  AdminApiService,
  AdminUser,
  AdminUserUpdate,
  AdminApplicationJob,
} from '../../../services/admin/admin-api.service';

@Component({
  standalone: true,
  selector: 'app-admin-user-detail',
  templateUrl: './admin-user-detail.component.html',
  styleUrls: ['./admin-user-detail.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
})
export class AdminUserDetailComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private api = inject(AdminApiService);

  userId = Number(this.route.snapshot.paramMap.get('id'));

  form = this.fb.nonNullable.group({
    userName: [''],
    userSurname: [''],
    userPhoneNumber: [''],
    userCitizenship: [''],
    userEmploymentStatus: [''],
    is_admin: [false],
  });

  loading = signal(true);
  saving = signal(false);
  error = signal('');
  touched = signal(false);

  applications = signal<AdminApplicationJob[]>([]);

  constructor() {
    this.loadUser();
    this.loadApplications();

    this.form.valueChanges.subscribe(() => {
      this.touched.set(true);
    });
  }

  private loadUser() {
    this.loading.set(true);
    this.error.set('');

    this.api.getUser(this.userId).subscribe({
      next: (user: AdminUser) => {
        this.form.patchValue({
          userName: user.userName || '',
          userSurname: user.userSurname || '',
          userPhoneNumber: user.userPhoneNumber || '',
          userCitizenship: user.userCitizenship || '',
          userEmploymentStatus: user.userEmploymentStatus || '',
          is_admin: !!user.is_admin,
        });

        this.loading.set(false);
        this.touched.set(false);
      },
      error: () => {
        this.error.set('Failed to load user.');
        this.loading.set(false);
      },
    });
  }

  private loadApplications() {
    this.api.getUserApplications(this.userId).subscribe({
      next: (apps) => this.applications.set(apps),
      error: () => {
        // optional: show separate error state for apps
      },
    });
  }

  save() {
    if (this.form.invalid) return;

    this.saving.set(true);
    this.error.set('');

    const v = this.form.value;

    const payload: AdminUserUpdate = {
        userName: v.userName ?? undefined,
        userSurname: v.userSurname ?? undefined,
        userPhoneNumber: v.userPhoneNumber ?? undefined,
        userCitizenship: v.userCitizenship ?? undefined,
        userEmploymentStatus: v.userEmploymentStatus ?? undefined,
        is_admin: v.is_admin ?? undefined,
    };

    this.api.updateUser(this.userId, payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.touched.set(false);
      },
      error: () => {
        this.error.set('Failed to save changes.');
        this.saving.set(false);
      },
    });
  }
}
