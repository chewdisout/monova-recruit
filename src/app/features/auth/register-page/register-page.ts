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
import { TranslatePipe } from '@ngx-translate/core';

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

  genders = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  phoneCodes = [
    { value: '+1', label: 'United States / Canada (+1)' },
    { value: '+7', label: 'Russia / Kazakhstan (+7)' },
    { value: '+20', label: 'Egypt (+20)' },
    { value: '+27', label: 'South Africa (+27)' },
    { value: '+30', label: 'Greece (+30)' },
    { value: '+31', label: 'Netherlands (+31)' },
    { value: '+32', label: 'Belgium (+32)' },
    { value: '+33', label: 'France (+33)' },
    { value: '+34', label: 'Spain (+34)' },
    { value: '+36', label: 'Hungary (+36)' },
    { value: '+39', label: 'Italy (+39)' },
    { value: '+40', label: 'Romania (+40)' },
    { value: '+41', label: 'Switzerland (+41)' },
    { value: '+43', label: 'Austria (+43)' },
    { value: '+44', label: 'United Kingdom (+44)' },
    { value: '+45', label: 'Denmark (+45)' },
    { value: '+46', label: 'Sweden (+46)' },
    { value: '+47', label: 'Norway (+47)' },
    { value: '+48', label: 'Poland (+48)' },
    { value: '+49', label: 'Germany (+49)' },
    { value: '+351', label: 'Portugal (+351)' },
    { value: '+352', label: 'Luxembourg (+352)' },
    { value: '+353', label: 'Ireland (+353)' },
    { value: '+354', label: 'Iceland (+354)' },
    { value: '+355', label: 'Albania (+355)' },
    { value: '+356', label: 'Malta (+356)' },
    { value: '+357', label: 'Cyprus (+357)' },
    { value: '+358', label: 'Finland (+358)' },
    { value: '+359', label: 'Bulgaria (+359)' },
    { value: '+370', label: 'Lithuania (+370)' },
    { value: '+371', label: 'Latvia (+371)' },
    { value: '+372', label: 'Estonia (+372)' },
    { value: '+373', label: 'Moldova (+373)' },
    { value: '+374', label: 'Armenia (+374)' },
    { value: '+375', label: 'Belarus (+375)' },
    { value: '+376', label: 'Andorra (+376)' },
    { value: '+377', label: 'Monaco (+377)' },
    { value: '+378', label: 'San Marino (+378)' },
    { value: '+380', label: 'Ukraine (+380)' },
    { value: '+381', label: 'Serbia (+381)' },
    { value: '+382', label: 'Montenegro (+382)' },
    { value: '+383', label: 'Kosovo (+383)' },
    { value: '+385', label: 'Croatia (+385)' },
    { value: '+386', label: 'Slovenia (+386)' },
    { value: '+387', label: 'Bosnia & Herzegovina (+387)' },
    { value: '+389', label: 'North Macedonia (+389)' },
    { value: '+420', label: 'Czech Republic (+420)' },
    { value: '+421', label: 'Slovakia (+421)' },
    { value: '+423', label: 'Liechtenstein (+423)' },
    { value: '+501', label: 'Belize (+501)' },
    { value: '+502', label: 'Guatemala (+502)' },
    { value: '+503', label: 'El Salvador (+503)' },
    { value: '+504', label: 'Honduras (+504)' },
    { value: '+505', label: 'Nicaragua (+505)' },
    { value: '+506', label: 'Costa Rica (+506)' },
    { value: '+507', label: 'Panama (+507)' },
    { value: '+509', label: 'Haiti (+509)' },
    { value: '+52', label: 'Mexico (+52)' },
    { value: '+54', label: 'Argentina (+54)' },
    { value: '+55', label: 'Brazil (+55)' },
    { value: '+56', label: 'Chile (+56)' },
    { value: '+57', label: 'Colombia (+57)' },
    { value: '+58', label: 'Venezuela (+58)' },
    { value: '+60', label: 'Malaysia (+60)' },
    { value: '+61', label: 'Australia (+61)' },
    { value: '+62', label: 'Indonesia (+62)' },
    { value: '+63', label: 'Philippines (+63)' },
    { value: '+64', label: 'New Zealand (+64)' },
    { value: '+65', label: 'Singapore (+65)' },
    { value: '+66', label: 'Thailand (+66)' },
    { value: '+81', label: 'Japan (+81)' },
    { value: '+82', label: 'South Korea (+82)' },
    { value: '+84', label: 'Vietnam (+84)' },
    { value: '+86', label: 'China (+86)' },
    { value: '+90', label: 'Turkey (+90)' },
    { value: '+91', label: 'India (+91)' },
    { value: '+92', label: 'Pakistan (+92)' },
    { value: '+93', label: 'Afghanistan (+93)' },
    { value: '+94', label: 'Sri Lanka (+94)' },
    { value: '+95', label: 'Myanmar (+95)' },
    { value: '+98', label: 'Iran (+98)' },
    { value: '+211', label: 'South Sudan (+211)' },
    { value: '+212', label: 'Morocco (+212)' },
    { value: '+213', label: 'Algeria (+213)' },
    { value: '+216', label: 'Tunisia (+216)' },
    { value: '+218', label: 'Libya (+218)' },
    { value: '+220', label: 'Gambia (+220)' },
    { value: '+221', label: 'Senegal (+221)' },
    { value: '+222', label: 'Mauritania (+222)' },
    { value: '+223', label: 'Mali (+223)' },
    { value: '+224', label: 'Guinea (+224)' },
    { value: '+225', label: 'Côte d’Ivoire (+225)' },
    { value: '+226', label: 'Burkina Faso (+226)' },
    { value: '+227', label: 'Niger (+227)' },
    { value: '+228', label: 'Togo (+228)' },
    { value: '+229', label: 'Benin (+229)' },
    { value: '+230', label: 'Mauritius (+230)' },
    { value: '+231', label: 'Liberia (+231)' },
    { value: '+232', label: 'Sierra Leone (+232)' },
    { value: '+233', label: 'Ghana (+233)' },
    { value: '+234', label: 'Nigeria (+234)' },
    { value: '+235', label: 'Chad (+235)' },
    { value: '+236', label: 'Central African Republic (+236)' },
    { value: '+237', label: 'Cameroon (+237)' },
    { value: '+238', label: 'Cape Verde (+238)' },
    { value: '+239', label: 'São Tomé & Príncipe (+239)' },
    { value: '+240', label: 'Equatorial Guinea (+240)' },
    { value: '+241', label: 'Gabon (+241)' },
    { value: '+242', label: 'Congo (+242)' },
    { value: '+243', label: 'DR Congo (+243)' },
    { value: '+244', label: 'Angola (+244)' },
    { value: '+245', label: 'Guinea-Bissau (+245)' },
    { value: '+246', label: 'Diego Garcia (+246)' },
    { value: '+248', label: 'Seychelles (+248)' },
    { value: '+249', label: 'Sudan (+249)' },
    { value: '+250', label: 'Rwanda (+250)' },
    { value: '+251', label: 'Ethiopia (+251)' },
    { value: '+252', label: 'Somalia (+252)' },
    { value: '+253', label: 'Djibouti (+253)' },
    { value: '+254', label: 'Kenya (+254)' },
    { value: '+255', label: 'Tanzania (+255)' },
    { value: '+256', label: 'Uganda (+256)' },
    { value: '+257', label: 'Burundi (+257)' },
    { value: '+258', label: 'Mozambique (+258)' },
    { value: '+260', label: 'Zambia (+260)' },
    { value: '+261', label: 'Madagascar (+261)' },
    { value: '+263', label: 'Zimbabwe (+263)' },
    { value: '+264', label: 'Namibia (+264)' },
    { value: '+265', label: 'Malawi (+265)' },
    { value: '+266', label: 'Lesotho (+266)' },
    { value: '+267', label: 'Botswana (+267)' },
    { value: '+268', label: 'Eswatini (+268)' },
    { value: '+269', label: 'Comoros (+269)' },
    { value: '+290', label: 'Saint Helena (+290)' },
    { value: '+298', label: 'Faroe Islands (+298)' },
    { value: '+299', label: 'Greenland (+299)' },
    { value: '+350', label: 'Gibraltar (+350)' },
    { value: '+351', label: 'Portugal (+351)' },
    { value: '+354', label: 'Iceland (+354)' },
    { value: '+357', label: 'Cyprus (+357)' },
    { value: '+358', label: 'Finland (+358)' },
    { value: '+372', label: 'Estonia (+372)' },
    { value: '+380', label: 'Ukraine (+380)' },
    { value: '+385', label: 'Croatia (+385)' },
    { value: '+386', label: 'Slovenia (+386)' },
    { value: '+387', label: 'Bosnia & Herzegovina (+387)' },
    { value: '+389', label: 'North Macedonia (+389)' },
    { value: '+420', label: 'Czech Republic (+420)' },
    { value: '+421', label: 'Slovakia (+421)' },
    { value: '+852', label: 'Hong Kong (+852)' },
    { value: '+853', label: 'Macau (+853)' },
    { value: '+855', label: 'Cambodia (+855)' },
    { value: '+856', label: 'Laos (+856)' },
    { value: '+880', label: 'Bangladesh (+880)' },
    { value: '+886', label: 'Taiwan (+886)' },
    { value: '+961', label: 'Lebanon (+961)' },
    { value: '+962', label: 'Jordan (+962)' },
    { value: '+963', label: 'Syria (+963)' },
    { value: '+964', label: 'Iraq (+964)' },
    { value: '+965', label: 'Kuwait (+965)' },
    { value: '+966', label: 'Saudi Arabia (+966)' },
    { value: '+967', label: 'Yemen (+967)' },
    { value: '+968', label: 'Oman (+968)' },
    { value: '+971', label: 'United Arab Emirates (+971)' },
    { value: '+972', label: 'Israel (+972)' },
    { value: '+973', label: 'Bahrain (+973)' },
    { value: '+974', label: 'Qatar (+974)' },
    { value: '+975', label: 'Bhutan (+975)' },
    { value: '+976', label: 'Mongolia (+976)' },
    { value: '+977', label: 'Nepal (+977)' },
    { value: '+992', label: 'Tajikistan (+992)' },
    { value: '+993', label: 'Turkmenistan (+993)' },
    { value: '+994', label: 'Azerbaijan (+994)' },
    { value: '+995', label: 'Georgia (+995)' },
    { value: '+996', label: 'Kyrgyzstan (+996)' },
    { value: '+998', label: 'Uzbekistan (+998)' },
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
