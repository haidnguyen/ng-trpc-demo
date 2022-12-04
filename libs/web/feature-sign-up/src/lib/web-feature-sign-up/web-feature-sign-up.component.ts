import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { fromProcedure, injectClient } from '@conduit/web/trpc';
import { ForFormErrorsDirective, FormInvalidPipe } from '@conduit/web/utilities';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'conduit-web-feature-sign-up',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormInvalidPipe, ForFormErrorsDirective],
  templateUrl: './web-feature-sign-up.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebFeatureSignUpComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly client = injectClient();
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  readonly form = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(8)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    const formValue = this.form.getRawValue();

    fromProcedure(this.client.user.userCreate.mutate)({
      username: formValue.username,
      email: formValue.email,
      password: formValue.password,
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: createdUser => {
          console.log({ createdUser });
          this.router.navigateByUrl('/login');
        },
        error: err => {
          console.log({ err });
        },
      });
  }
}
