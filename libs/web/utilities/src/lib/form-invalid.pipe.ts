import { Pipe, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';

@Pipe({
  name: 'formInvalid',
  standalone: true,
  pure: false,
})
export class FormInvalidPipe implements PipeTransform {
  transform(formControl: FormControl<unknown>) {
    return formControl.invalid && (formControl.touched || formControl.dirty);
  }
}
