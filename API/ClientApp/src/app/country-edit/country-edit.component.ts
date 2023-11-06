import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country } from '../models/country.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseFormComponent } from '../base/base-form.component';
import { CountryService } from '../services/country.service';

@Component({
  selector: 'app-country-edit',
  templateUrl: './country-edit.component.html',
  styleUrls: ['./country-edit.component.css']
})
export class CountryEditComponent extends BaseFormComponent implements OnInit {

  title: string;

  form: FormGroup;

  // the country object to edit or create
  country: Country;

  // the country object id, as fetched from the active route:
  // It's NULL when we're adding a new country,
  // and not NULL when we're editing an existing one.
  id?: number;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private countryService: CountryService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required, this.isDupeField('name')],
      iso2: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]{2}$/)], this.isDupeField('iso2')],
      iso3: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]{3}$/)], this.isDupeField('iso3')],
    });
    this.loadData();
  }

  loadData(): void {
    this.id = +this.activatedRoute.snapshot.paramMap.get('id');
    // EDIT MODE
    if (this.id) {
      this.countryService.get(this.id).subscribe(result => {
          this.country = result;
          this.title = 'Edit - ' + this.country.name;

          this.form.patchValue(this.country);
        },
        error => console.error(error));
      // CREATE MODE
    } else {
      this.title = 'Create a new Country';
    }
  }


  onSubmit(): void {
    const country = this.id ? this.country : {} as Country;
    country.name = this.form.get('name').value;
    country.iso2 = this.form.get('iso2').value;
    country.iso3 = this.form.get('iso3').value;

    // EDIT MODE
    if (this.id) {
      this.countryService.put(country).subscribe(result => {
          console.log(`Country with id ${this.country.id} has been updated.`);
          this.router.navigateByUrl('/countries');
        },
        error => console.error(error));
      // CREATE MODE
    } else {
      this.countryService.post(country).subscribe(result => {
          console.log(`Country with id ${result.id} has been created.`);
          this.router.navigateByUrl('/countries');
        },
        error => console.error(error));
    }
  }

  isDupeField(fieldName: string): AsyncValidatorFn {
    const countryId = this.id ? this.id.toString() : '0';

    return (control: AbstractControl): Observable<Record<string, any> | null> => {
      return this.countryService.isDupeField(countryId, fieldName, control.value).pipe(
        map(result => {
          return result ? {isDupeField: true} : null;
        }));
    };
  }

}
