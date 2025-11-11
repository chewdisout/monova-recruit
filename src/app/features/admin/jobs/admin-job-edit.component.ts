import {
    Component,
    inject,
    signal,
    OnInit,
} from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
    AdminApiService
} from '../../../services/admin/admin-api.service';
import {
    AdminJob,
    AdminJobCreate,
    AdminJobUpdate,
    JobTranslationUpsert,
    JobTranslation
} from '../../../models/admin';

const LANGS = ['en', 'pl', 'ru', 'lv', 'lt', 'ee'];

@Component({
  standalone: true,
  selector: 'app-admin-job-edit',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-job-edit.component.html',
})
export class AdminJobEditComponent implements OnInit {
    private fb = inject(FormBuilder);
    private api = inject(AdminApiService);
    private route = inject(ActivatedRoute);

    jobId = 0;

    loading = signal(false);
    savingBase = signal(false);
    savingTr = signal(false);
    error = signal('');

    langs = LANGS;
    activeLang = signal<string>('en');

    baseForm = this.fb.group({
        title: ['', Validators.required],
        company_name: ['', Validators.required],
        reference_code: [''],
        country: ['', Validators.required],
        city: [''],
        workplace_address: [''],
        category: ['', Validators.required],
        employment_type: [''],
        shift_type: [''],
        salary_from: [null as number | null],
        salary_to: [null as number | null],
        currency: ['EUR'],
        salary_type: ['monthly'],
        is_net: [false],
        housing_provided: [false],
        housing_details: [''],
        transport_provided: [false],
        bonuses: [''],
        min_experience_years: [0],
        language_required: ['', Validators.maxLength(80)],
        documents_required: [''],
        driving_license_required: [false],
        short_description: ['', Validators.required],
        full_description: ['', Validators.required],
        responsibilities: [''],
        requirements_text: [''],
        benefits_text: [''],
        is_active: [true],
    });

    trForms: Record<string, ReturnType<FormBuilder['group']>> = {};

    ngOnInit() {
        this.langs.forEach((l) => {
        this.trForms[l] = this.fb.group({
            title: [''],
            short_description: [''],
            full_description: [''],
            responsibilities: [''],
            requirements_text: [''],
            benefits_text: [''],
            housing_details: [''],
            documents_required: [''],
            bonuses: [''],
            language_required: [''],
        });
        });

        this.route.params.subscribe((p) => {
        const id = Number(p['id']);
        if (!id) return;
        this.jobId = id;
        this.loadJob();
        this.loadTranslations();
        });
    }

    setLang(lang: string) {
        this.activeLang.set(lang);
    }

    private loadJob() {
        this.loading.set(true);
        this.api.getJob(this.jobId).subscribe({
        next: (job: AdminJob) => {
            this.loading.set(false);
            this.baseForm.patchValue({
            ...job,
            is_active: !!job.is_active,
            is_net: !!(job as any).is_net,
            housing_provided: !!(job as any).housing_provided,
            transport_provided: !!(job as any).transport_provided,
            });
        },
        error: () => {
            this.loading.set(false);
            this.error.set('Failed to load job.');
        },
        });
    }

    private loadTranslations() {
        if (!this.jobId) return;
        this.api.getJobTranslations(this.jobId).subscribe({
        next: (trs: JobTranslation[]) => {
            trs.forEach((tr) => {
                const f = this.trForms[tr.lang_code];
                if (f) f.patchValue(tr);
            });
        },
        error: () => {
        },
        });
    }

    saveBase() {
        if (this.baseForm.invalid) {
            this.baseForm.markAllAsTouched();
            return;
        }

        const isUpdate = !!this.jobId;
        const payload = this.buildJobPayload(isUpdate);

        this.savingBase.set(true);

        const req$ = isUpdate
            ? this.api.updateJob(this.jobId!, payload as AdminJobUpdate)
            : this.api.createJob(payload as AdminJobCreate);

        req$.subscribe({
            next: (job) => {
            this.savingBase.set(false);
            this.error.set('');
            this.jobId = job.id;
            },
            error: () => {
            this.savingBase.set(false);
            this.error.set('Failed to save job.');
            },
        });
    }


    saveTranslation(lang: string) {
        if (!this.jobId) {
        this.error.set('Save base job first.');
        return;
        }

        const raw = this.trForms[lang].value;
        const payload: JobTranslationUpsert = {
        lang_code: lang,
        ...raw,
        };

        this.savingTr.set(true);

        this.api.upsertJobTranslation(this.jobId, lang, payload).subscribe({
        next: () => {
            this.savingTr.set(false);
            this.error.set('');
        },
        error: () => {
            this.savingTr.set(false);
            this.error.set('Failed to save translation.');
        },
        });
    }

    private buildJobPayload(isUpdate: boolean): AdminJobCreate | AdminJobUpdate {
        const raw = this.baseForm.value;
        const p: any = {};

        if (raw.title != null) {
            const t = String(raw.title).trim();
            if (t || !isUpdate) p.title = t;
        }

        if (raw.country != null) {
            const c = String(raw.country).trim();
            if (c || !isUpdate) p.country = c;
        }

        const setStr = (key: keyof typeof raw) => {
            const v = raw[key];
            if (v != null && String(v).trim() !== '') {
            p[key] = String(v).trim();
            }
        };

        const stringFields: (keyof typeof raw)[] = [
            'company_name',
            'reference_code',
            'city',
            'workplace_address',
            'category',
            'employment_type',
            'shift_type',
            'currency',
            'salary_type',
            'housing_details',
            'bonuses',
            'language_required',
            'documents_required',
            'short_description',
            'full_description',
            'responsibilities',
            'requirements_text',
            'benefits_text',
        ];

        stringFields.forEach((key) => setStr(key));

        if (raw.salary_from !== null && raw.salary_from !== undefined) {
        p.salary_from = Number(raw.salary_from);
        }

        if (raw.salary_to !== null && raw.salary_to !== undefined) {
        p.salary_to = Number(raw.salary_to);
        }

        if (raw.min_experience_years !== null && raw.min_experience_years !== undefined) {
        p.min_experience_years = Number(raw.min_experience_years);
        }


        if (raw.is_active != null) p.is_active = !!raw.is_active;
        if (raw.is_net != null) p.is_net = !!raw.is_net;
        if (raw.housing_provided != null)
            p.housing_provided = !!raw.housing_provided;
        if (raw.transport_provided != null)
            p.transport_provided = !!raw.transport_provided;
        if (raw.driving_license_required != null)
            p.driving_license_required = !!raw.driving_license_required;

        return p as AdminJobCreate | AdminJobUpdate;
    }

}
