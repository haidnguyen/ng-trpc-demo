import { Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';

interface ForFormErrorsContext {
  $implicit: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detail: any;
}

@Directive({
  selector: '[conduitForFormErrors]',
  standalone: true,
})
export class ForFormErrorsDirective {
  private readonly tr = inject(TemplateRef);
  private readonly vcr = inject(ViewContainerRef);

  private errors!: Array<[string, string]>;

  static ngTemplateContextGuard(dir: ForFormErrorsDirective, ctx: unknown): ctx is ForFormErrorsContext {
    return true;
  }

  @Input() set conduitForFormErrorsOf(errors: Record<string, string> | null) {
    this.vcr.clear();
    if (!errors) {
      this.errors = [];
    } else {
      this.errors = Object.entries(errors);
    }
    if (this.errors.length > 0) {
      this.errors.forEach(([error, detail]) => {
        this.vcr.createEmbeddedView(this.tr, { $implicit: error, detail });
      });
    }
  }
}
