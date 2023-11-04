import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country } from '../models/country.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BASE_URL } from '../_config/app.config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseFormComponent } from '../base/base-form.component';

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
    private http: HttpClient,
    @Inject(BASE_URL) private baseurl: string
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
      const url = this.baseurl + 'Countries/' + this.id;
      this.http.get<Country>(url).subscribe(result => {
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
      const url = this.baseurl + 'Countries/' + this.id;
      this.http.put<Country>(url, country).subscribe(result => {
          console.log(`Country with id ${this.country.id} has been updated.`);
          this.router.navigateByUrl('/countries');
        },
        error => console.error(error));
      // CREATE MODE
    } else {
      const url = this.baseurl + 'Countries';
      this.http.post<Country>(url, country).subscribe(result => {
          console.log(`Country with id ${result.id} has been created.`);
          this.router.navigateByUrl('/countries');
        },
        error => console.error(error));
    }
  }

  isDupeField(fieldName: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<Record<string, any> | null> => {
      const params = new HttpParams()
        .set('countryId', this.id ? this.id.toString() : '0')
        .set('fieldName', fieldName)
        .set('fieldValue', control.value);

      const url = this.baseurl + 'Countries/IsDupeField';
      return this.http.post<boolean>(url, null, {params}).pipe(
        map(result => {
          return result ? {isDupeField: true} : null;
        }));
    };
  }

}
