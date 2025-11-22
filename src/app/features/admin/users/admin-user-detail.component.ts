import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

import {
    AdminApiService,
} from '../../../services/admin/admin-api.service';

import { 
    AdminUser,
    AdminUserUpdate,
    AdminApplicationJob, 
} from '../../../models/admin';

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
  private router = inject(Router);

  deleting = signal(false);

  userId = Number(this.route.snapshot.paramMap.get('id'));

  form = this.fb.nonNullable.group({
    userName: [''],
    userSurname: [''],
    userPhoneNumber: [''],
    userCitizenship: [''],
    userEmploymentStatus: [''],
    userGender: [''],
    userAge: [null as number | null],
    userPrefferedJob: [''],
    userSecondPrefferedJob: [''],
    userPrefferedJobLocation: [''],
    userSecondPrefferedJobLocation: [''],
    userTellAboutYourSelf: [''],
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
          userGender: user.userGender || '',
          userAge: user.userAge ?? null,
          userPrefferedJob: user.userPrefferedJob || '',
          userSecondPrefferedJob: user.userSecondPrefferedJob || '',
          userPrefferedJobLocation: user.userPrefferedJobLocation || '',
          userSecondPrefferedJobLocation: user.userSecondPrefferedJobLocation || '',
          userTellAboutYourSelf: user.userTellAboutYourSelf || '',
          is_admin: !!user.is_admin, // or !!user.isAdmin depending on your AdminUser model
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
      userGender: v.userGender ?? undefined,
      userAge: v.userAge ?? undefined,
      userPrefferedJob: v.userPrefferedJob ?? undefined,
      userSecondPrefferedJob: v.userSecondPrefferedJob ?? undefined,
      userPrefferedJobLocation: v.userPrefferedJobLocation ?? undefined,
      userSecondPrefferedJobLocation: v.userSecondPrefferedJobLocation ?? undefined,
      userTellAboutYourSelf: v.userTellAboutYourSelf ?? undefined,
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

  deleteUser() {
    const confirmed = window.confirm(
      'Delete this user and all related applications? This cannot be undone.'
    );
    if (!confirmed) return;

    this.deleting.set(true);
    this.error.set('');

    this.api.deleteUser(this.userId).subscribe({
      next: () => {
        this.deleting.set(false);
        this.router.navigate(['/admin/users']);
      },
      error: () => {
        this.deleting.set(false);
        this.error.set('Failed to delete user.');
      },
    });
  }
}
