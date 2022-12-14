import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, fromProcedure, injectClient, injectToken } from '@conduit/web/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'conduit-web-feature-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './web-feature-login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class WebFeatureLoginComponent implements OnDestroy, OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly client = injectClient();
  private readonly token = injectToken();
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly destroy$ = new Subject<void>();

  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  ngOnInit() {
    this.authService
      .isAuth()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuth => {
        if (isAuth) {
          this.router.navigateByUrl('/home');
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    const formValue = this.form.getRawValue();

    fromProcedure(this.client.user.userLogin.query)({
      email: formValue.email,
      password: formValue.password,
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: credential => {
          this.token.setAccessToken(credential.user.token);
          this.authService.authenticateUser(credential.user);
          this.router.navigateByUrl('/home');
        },
        error: err => {
          console.log({ err });
        },
      });
  }
}
