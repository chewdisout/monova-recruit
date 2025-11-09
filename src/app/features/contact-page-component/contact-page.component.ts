import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-contact-page',
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss'],
})
export class ContactPageComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: [
      '',
      [Validators.required, Validators.email, Validators.maxLength(254)],
    ],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  sending = signal(false);
  success = signal(false);
  error = signal('');

  get f() {
    return this.form.controls;
  }

  submit() {
    this.error.set('');
    this.success.set(false);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.sending.set(true);

    const payload = this.form.value;
    console.log('Contact form payload:', payload);

    setTimeout(() => {
      this.sending.set(false);
      this.success.set(true);
      this.form.reset();
    }, 500);
  }
}
