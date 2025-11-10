import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import {
  AdminApiService,
  AdminJob,
  AdminJobCreate,
  AdminJobUpdate,
  JobTranslationUpsert,
} from '../../../services/admin/admin-api.service';

const LANGS = ['en', 'lv', 'lt', 'pl', 'ru'];

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-job-edit.component.html',
  styleUrls: [],
})
export class AdminJobEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(AdminApiService);
  private fb = inject(FormBuilder);

  jobId: number | null = null;
  loading = signal(true);
  saving = signal(false);
  error = signal('');

  baseForm = this.fb.group({
    title: [''],
    country: [''],
    city: [''],
    category: [''],
    short_description: [''],
    full_description: [''],
    is_active: [true],
  });

  activeLang = signal<'en' | 'lv' | 'lt' | 'pl' | 'ru'>('en');

  translationForms: Record<string, ReturnType<FormBuilder['group']>> = {};

  constructor() {
    LANGS.forEach(l => {
      this.translationForms[l] = this.fb.group({
        title: [''],
        short_description: [''],
        full_description: [''],
        requirements_text: [''],
        benefits_text: [''],
      });
    });
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam || idParam === 'new') {
      this.loading.set(false);
      return;
    }

    this.jobId = Number(idParam);

    this.api.getJob(this.jobId).subscribe({
      next: (job: AdminJob) => {
        this.baseForm.patchValue({
          title: job.title,
          country: job.country,
          city: job.city || '',
          category: job.category || '',
          short_description: job.short_description || '',
          full_description: job.full_description || '',
          is_active: job.is_active,
        });

        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load job.');
        this.loading.set(false);
      },
    });
  }

  setLang(lang: any) {
    this.activeLang.set(lang);
  }

  saveBase() {
    this.saving.set(true);
    this.error.set('');

    const payload = this.baseForm.value as AdminJobUpdate | AdminJobCreate;

    if (this.jobId) {
      this.api.updateJob(this.jobId, payload).subscribe({
        next: () => (this.saving.set(false)),
        error: () => {
          this.error.set('Failed to save job.');
          this.saving.set(false);
        },
      });
    } else {
      this.api.createJob(payload as AdminJobCreate).subscribe({
        next: job => {
          this.saving.set(false);
          this.router.navigate(['/admin/jobs', job.id]);
        },
        error: () => {
          this.error.set('Failed to create job.');
          this.saving.set(false);
        },
      });
    }
  }

  saveTranslation(lang: string) {
    if (!this.jobId) return;
    const form = this.translationForms[lang];
    const v = form.value;

    const payload: JobTranslationUpsert = {
      lang_code: lang,
      title: v.title || null,
      short_description: v.short_description || null,
      full_description: v.full_description || null,
      requirements_text: v.requirements_text || null,
      benefits_text: v.benefits_text || null,
    };

    this.api.upsertJobTranslation(this.jobId, lang, payload).subscribe({
      next: () => {},
      error: () => {
        this.error.set(`Failed to save ${lang.toUpperCase()} translation.`);
      },
    });
  }
}
