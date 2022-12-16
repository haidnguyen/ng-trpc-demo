import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, fromProcedure, injectClient } from '@conduit/web/core';
import { ForFormErrorsDirective, FormInvalidPipe } from '@conduit/web/utilities';
import { User } from '@prisma/client';
import { iif, NEVER, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'conduit-web-feature-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormInvalidPipe, ForFormErrorsDirective],
  templateUrl: './web-feature-settings.component.html',
  styleUrls: ['./web-feature-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class WebFeatureSettingsComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly client = injectClient();
  private readonly destroy$ = new Subject<void>();
  userId: User['id'] | null = null;

  readonly form = this.formBuilder.group({
    image: [''],
    username: ['', [Validators.required, Validators.minLength(8)]],
    bio: [''],
    email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
  });

  ngOnInit() {
    this.authService
      .isAuth()
      .pipe(
        switchMap(isAuth => iif(() => isAuth, fromProcedure(this.client.user.me.query)(), NEVER)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: user => {
          this.form.patchValue({
            email: user.email,
            bio: user.bio ?? '',
            username: user.username,
            image: user.image ?? '',
          });
          this.userId = user.id;
        },
        error: (err: Error) => {
          console.log({ err });
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout() {
    this.authService.logout();
  }

  submit() {
    if (this.form.invalid || !this.userId) {
      return;
    }
    const formValue = this.form.getRawValue();
    fromProcedure(this.client.user.userUpdate.mutate)({
      username: formValue.username,
      bio: formValue.bio,
      image: formValue.image,
      id: this.userId,
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe(updatedUser => {
        console.log({ updatedUser });
      });
  }
}
