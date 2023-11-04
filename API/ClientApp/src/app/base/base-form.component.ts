import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  template: ''
})
export abstract class BaseFormComponent {
  form: FormGroup;

  protected constructor() {
  }

  getControl(name: string) {
    return this.form.get(name);
  }

  isValid(name: string) {
    const control = this.getControl(name);
    return control && control.valid;
  }

  isChanged(name: string) {
    const control = this.getControl(name);
    return control && (control.dirty || control.touched);
  }

  hasError(name: string) {
    const control = this.getControl(name);
    return control && (control.dirty || control.touched) && control.invalid;
  }
}
