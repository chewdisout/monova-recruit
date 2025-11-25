import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ReactiveFormsModule, 
  FormBuilder, 
  Validators, 
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.services';
import { FastSignUpPayload, SignUpPayload } from '../../../models/user';
import { TranslatePipe } from '@ngx-translate/core';
import { citizenships, phoneCodes, genders } from '../../../services/helpers/dropdowns';

function ageRangeValidator(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') return null;
    const num = Number(value);
    if (Number.isNaN(num)) return { ageInvalid: true };
    if (num < min || num > max) return { ageRange: { min, max } };
    return null;
  };
}

function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value || '').toString().trim();
    if (!value) return { required: true };
    // digits only, length 5–15
    if (!/^[0-9]{5,15}$/.test(value)) {
      return { phoneInvalid: true };
    }
    return null;
  };
}

@Component({
  standalone: true,
  selector: 'app-register-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './register-page.html',
  styleUrls: ['./register-page.scss'],
})
export class RegisterPageComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  mode = signal<'fast' | 'full'>('fast');

  citizenships = citizenships;
  phoneCodes = phoneCodes;
  genders = genders;

  fastForm = this.fb.group({
    userEmail: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    acceptTerms: [false, [Validators.requiredTrue]],
  });

  fullForm = this.fb.group({
    userEmail: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],

    userName: ['', [Validators.required, Validators.minLength(1)]],
    userSurname: ['', [Validators.required, Validators.minLength(1)]],

    userAge: [null, [ageRangeValidator(18, 75)]],
    userGender: ['male', [Validators.required]],

    phoneCode: ['+371', [Validators.required]],
    phoneNumber: ['', [Validators.required, Validators.minLength(5), phoneNumberValidator()]],

    userCitizenship: ['', [Validators.required]],

    acceptTerms: [false, [Validators.requiredTrue]],
  });

  loading = signal(false);
  error = signal('');

  get fFast() {
    return this.fastForm.controls;
  }

  get fFull() {
    return this.fullForm.controls;
  }

  setMode(m: 'fast' | 'full') {
    this.mode.set(m);
    this.error.set('');
  }

  submitFast() {
    this.error.set('');

    if (this.fastForm.invalid) {
      this.fastForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const v = this.fastForm.value;

    // ONLY email + password
    const payload: Partial<FastSignUpPayload> = {
      userEmail: v.userEmail!.trim(),
      password: v.password!,
    };

    this.auth.fastRegister(payload as FastSignUpPayload).subscribe({
      next: () => {
        this.loading.set(false);
        this.fastForm.disable();
        this.auth.login(payload.userEmail!, payload.password!).subscribe({
          next: () => {
            this.loading.set(false);
            this.router.navigate(['/profile']);
          },
          error: (err) => {
            this.loading.set(false);
            this.error.set(
              err?.error?.detail || 'Incorrect email or password.'
            );
          },
        });
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err?.error?.detail ??
          'Failed to create account. Please check your data and try again.'
        );
      },
    });
  }

  submitFull() {
    this.error.set('');

    if (this.fullForm.invalid) {
      this.fullForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const v = this.fullForm.value;

    const payload: SignUpPayload = {
      userEmail: v.userEmail!.trim(),
      password: v.password!,
      userName: v.userName!.trim(),
      userSurname: v.userSurname!.trim(),
      userAge: v.userAge ?? undefined,
      userGender: v.userGender!,
      userPhoneNumber: `${v.phoneCode}${(v.phoneNumber || '').replace(/\s+/g, '')}`,
      userCitizenship: v.userCitizenship!,
      userEmploymentStatus: 'not-employed'
    };

    this.auth.register(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.fullForm.disable();
        this.auth.login(payload.userEmail!, payload.password!).subscribe({
          next: () => {
            this.loading.set(false);
            this.router.navigate(['/profile']);
          },
          error: (err) => {
            this.loading.set(false);
            this.error.set(
              err?.error?.detail || 'Incorrect email or password.'
            );
          },
        });
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err?.error?.detail ??
          'Failed to create account. Please check your data and try again.'
        );
      },
    });
  }
}
