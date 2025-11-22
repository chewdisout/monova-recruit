import {
  Component,
  OnInit,
  inject,
  computed,
  effect,
  signal,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { ProfileUpdatePayload } from '../../models/user';
import { ApplicationsService, ApplicationWithJob } from '../../services/application/applications.service';
import { AuthService } from '../../services/auth/auth.services';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile-page-component',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile-page-component.html',
  styleUrl: './profile-page-component.scss',
})
export class ProfilePageComponent {
    private fb = inject(FormBuilder);
    private userService = inject(UserService);
    private apps = inject(ApplicationsService);
    private auth = inject(AuthService);

    @ViewChild('cvInput') cvInput?: ElementRef<HTMLInputElement>;

    cvUploading = signal(false);
    cvError = signal('');
    cvFileName = signal<string | null>(null);
    cvDeleting = signal(false);

    user = computed(() => this.userService.user());
    loading = computed(() => this.userService.loading());
    error = computed(() => this.userService.error());

    experiences = computed(() => this.userService.experiences());
    expLoading = computed(() => this.userService.expLoading());
    expError = computed(() => this.userService.expError());

    saving = signal(false);
    saveError = signal('');
    saveSuccess = signal(false);

    applications = signal<ApplicationWithJob[]>([]);
    appsLoading = signal(false);
    appsError = signal('');

    cancelAppId = signal<number | null>(null);

    jobOptions = [
      'Warehouse worker',
      'Production worker',
      'Forklift driver',
      'Packer',
      'Driver',
      'Cleaner',
      'Hospitality staff',
    ];

    locationOptions = [
      'Germany',
      'Netherlands',
      'Finland',
      'France',
      'Other EU',
    ];

    profileForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      userSurname: ['', [Validators.required, Validators.minLength(3)]],
      userEmail: [{ value: '', disabled: true }],
      userPhoneNumber: ['', [Validators.required, Validators.minLength(5)]],

      userCitizenship: ['', [Validators.required]],
      userGender: ['', [Validators.required]],
      userAge: ['', [Validators.required]],

      userPrefferedJob: [''],
      userSecondPrefferedJob: [''],
      userPrefferedJobLocation: [''],
      userSecondPrefferedJobLocation: [''],

      userTellAboutYourSelf: ['']
    });

    newExperienceControl = this.fb.control('', [Validators.minLength(2)]);

    get f() {
      return this.profileForm.controls;
    }

    constructor() {
      effect(() => {
        const u = this.user();
        if (u) {
          this.profileForm.patchValue(
            {
              userName: u.userName || '',
              userSurname: u.userSurname || '',
              userEmail: u.userEmail || '',
              userPhoneNumber: u.userPhoneNumber || '',
              userCitizenship: u.userCitizenship || '',
              userGender: u.userGender || '',
              userAge: u.userAge != null ? String(u.userAge) : '',
              userPrefferedJob: u.userPrefferedJob || '',
              userSecondPrefferedJob: u.userSecondPrefferedJob || '',
              userPrefferedJobLocation: u.userPrefferedJobLocation || '',
              userSecondPrefferedJobLocation: u.userSecondPrefferedJobLocation || '',
              userTellAboutYourSelf: u.userTellAboutYourSelf || '',
            },
            { emitEvent: false }
          );

          this.cvFileName.set(u.cv_original_name || null);
        }
      });
    }

    saveProfile() {
      this.saveError.set('');
      this.saveSuccess.set(false);

      if (this.profileForm.invalid) {
        this.profileForm.markAllAsTouched();
        return;
      }

      this.saving.set(true);

      const raw = this.profileForm.getRawValue();

      const payload: ProfileUpdatePayload = {
        userName: raw.userName!.trim(),
        userSurname: raw.userSurname!.trim(),
        userAge: Number(raw.userAge),
        userGender: raw.userGender!,
        userPhoneNumber: raw.userPhoneNumber!.toString().trim(),
        userCitizenship: raw.userCitizenship!.trim(),
        userPrefferedJob: raw.userPrefferedJob?.trim() || null,
        userSecondPrefferedJob: raw.userSecondPrefferedJob?.trim() || null,
        userPrefferedJobLocation: raw.userPrefferedJobLocation?.trim() || null,
        userSecondPrefferedJobLocation: raw.userSecondPrefferedJobLocation?.trim() || null,
        userTellAboutYourSelf: raw.userTellAboutYourSelf?.trim() || null,
      };

      this.userService.updateProfile(payload).subscribe({
        next: () => {
          this.saving.set(false);
          this.saveSuccess.set(true);
        },
        error: (err) => {
          this.saving.set(false);
          this.saveError.set(err.message || 'Failed to save profile.');
        },
      });
    }

    ngOnInit() {
      this.userService.loadProfile();
      this.userService.loadExperiences();

       if (this.auth.isAuthenticated()) {
        this.appsLoading.set(true);
        this.apps.getMyApplications().subscribe({
          next: (apps) => {
            this.applications.set(apps);
            this.appsLoading.set(false);
          },
          error: () => {
            this.appsError.set('Unable to load your applications right now.');
            this.appsLoading.set(false);
          },
        });
      }
    }

    addExperience() {
      const val = (this.newExperienceControl.value || '').toString().trim();
      if (!val) return;
      this.userService.addExperience(val);
      this.newExperienceControl.reset();
    }

    removeExperience(id: number) {
      this.userService.removeExperience(id);
    }

    onUploadCvClick() {
      this.cvError.set('');
      this.cvInput?.nativeElement.click();
    }

    onDeleteCvClick() {
      this.cvError.set('');
      this.cvDeleting.set(true);

      this.userService.deleteCv().subscribe({
        next: () => {
          this.cvDeleting.set(false);
          this.cvFileName.set(null);
        },
        error: (err) => {
          this.cvDeleting.set(false);
          this.cvError.set(
            err?.error?.detail || 'Failed to delete CV. Please try again.'
          );
        },
      });
    }

    cancelApplication(appId: number) {
      this.appsError.set('');
      this.cancelAppId.set(appId);

      this.apps.removeMyApplication(appId).subscribe({
        next: () => {
          this.applications.update(apps =>
            apps.filter(a => a.id !== appId)
          );
          this.cancelAppId.set(null);
        },
        error: () => {
          this.appsError.set('Unable to cancel application.');
          this.cancelAppId.set(null);
        }
      });
    }

    onCvFileSelected(event: Event) {
      const input = event.target as HTMLInputElement;
      if (!input.files || input.files.length === 0) return;

      const file = input.files[0];

      // Optional: basic client-side validation
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!allowedTypes.includes(file.type)) {
        this.cvError.set('Please upload a PDF or Word document.');
        input.value = '';
        return;
      }

      this.cvUploading.set(true);
      this.cvError.set('');

      this.userService.uploadCv(file).subscribe({
        next: (res) => {
          this.cvUploading.set(false);
          this.cvFileName.set(res.original_name || file.name);

          // TODO: if backend returns URL/key, save it to the user profile
          // e.g. this.userService.updateProfile({ cvUrl: res.url }).subscribe(...)
        },
        error: (err) => {
          this.cvUploading.set(false);
          this.cvError.set(
            err?.error?.detail || 'Failed to upload CV. Please try again.'
          );
        },
      });

      // reset input so selecting the same file again still triggers change
      input.value = '';
    }
}
