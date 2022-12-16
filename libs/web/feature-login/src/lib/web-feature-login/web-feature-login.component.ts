import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@conduit/web/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'conduit-web-feature-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './web-feature-login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class WebFeatureLoginComponent implements OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly destroy$ = new Subject<void>();

  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    const formValue = this.form.getRawValue();

    this.authService
      .login({ email: formValue.email, password: formValue.password })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/home');
        },
        error: err => {
          console.log({ err });
        },
      });
  }
}
