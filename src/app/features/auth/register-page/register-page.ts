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
import { SignUpPayload } from '../../../models/user';

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
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-page.html',
  styleUrls: ['./register-page.scss'],
})
export class RegisterPageComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  genders = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  phoneCodes = [
    { value: '+49', label: 'Germany (+49)' },
    { value: '+31', label: 'Netherlands (+31)' },
    { value: '+358', label: 'Finland (+358)' },
    { value: '+33', label: 'France (+33)' },
    { value: '+371', label: 'Latvia (+371)' },
    { value: '+370', label: 'Lithuania (+370)' },
    { value: '+372', label: 'Estonia (+372)' },
    { value: '+48', label: 'Poland (+48)' },
    { value: '+420', label: 'Czech Rep. (+420)' },
    { value: '+421', label: 'Slovakia (+421)' },
  ];

  citizenships = [
    'Latvia',
    'Lithuania',
    'Estonia',
    'Poland',
    'Czech Republic',
    'Slovakia',
    'Romania',
    'Bulgaria',
    'Germany',
    'Netherlands',
    'Finland',
    'France',
    'Other EU',
    'Non-EU',
  ];

  form = this.fb.group({
    userEmail: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],

    userName: ['', [Validators.required, Validators.minLength(1)]],
    userSurname: ['', [Validators.required, Validators.minLength(1)]],

    userAge: [null, [ageRangeValidator(18, 75)]],
    userGender: ['male', [Validators.required]],

    phoneCode: ['+371', [Validators.required]],
    phoneNumber: ['', [Validators.required, Validators.minLength(5), phoneNumberValidator()]],

    userCitizenship: ['', [Validators.required]],
  });

  loading = signal(false);
  error = signal('');
  success = signal(false);

  get f() {
    return this.form.controls;
  }

  submit() {
    this.error.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const v = this.form.value;

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
        this.form.disable();  
        this.success.set(true);
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
