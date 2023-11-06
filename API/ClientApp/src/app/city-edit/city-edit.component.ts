import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, Validators } from '@angular/forms';
import { City } from '../models/city.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { Country } from '../models/country.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseFormComponent } from '../base/base-form.component';
import { CityService } from '../services/city.service';
import { CountryService } from '../services/country.service';

@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.css']
})
export class CityEditComponent extends BaseFormComponent implements OnInit {

  title: string;

  form: FormGroup;

  // the city object to edit or create
  city: City;

  // the city object id, as fetched from the active route:
  // It's NULL when we're adding a new city,
  // and not NULL when we're editing an existing one.
  id?: number;

  // the countries array for the select
  countries: Country[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cityService: CityService,
    private countryService: CountryService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      lat: new FormControl('', [Validators.required, Validators.pattern(/^[-]?[0-9]{1,3}(\.[0-9]{1,4})?$/)]),
      lon: new FormControl('', [Validators.required, Validators.pattern(/^[-]?[0-9]{1,3}(\.[0-9]{1,4})?$/)]),
      countryId: new FormControl('', Validators.required)
    }, null, this.isDupeCity());
    this.loadData();
  }

  loadData(): void {
    // load countries
    this.loadCountries();

    this.id = +this.activatedRoute.snapshot.paramMap.get('id');
    // EDIT MODE
    if (this.id) {
      this.cityService.get(this.id).subscribe(result => {
          this.city = result;
          this.title = 'Edit - ' + this.city.name;

          this.form.patchValue(this.city);
        },
        error => console.error(error));
      // CREATE MODE
    } else {
      this.title = 'Create a new City';
    }
  }

  loadCountries(): void {
    const params = new HttpParams()
      .set('pageIndex', '0')
      .set('pageSize', '9999')
      .set('sortColumn', 'name');
    this.countryService.getAllCountries()
      .subscribe(result => this.countries = result.data,
        error => console.error(error));
  }

  onSubmit(): void {
    const city = this.id ? this.city : {} as City;
    city.name = this.form.get('name').value;
    city.lat = +this.form.get('lat').value;
    city.lon = +this.form.get('lon').value;
    city.countryId = +this.form.get('countryId').value;

    // EDIT MODE
    if (this.id) {
      this.cityService.put(city).subscribe(result => {
          console.log(`City with id ${this.city.id} has been updated.`);
          this.router.navigateByUrl('/cities');
        },
        error => console.error(error));
      // CREATE MODE
    } else {
      this.cityService.post(city).subscribe(result => {
          console.log(`City with id ${result.id} has been created.`);
          this.router.navigateByUrl('/cities');
        },
        error => console.error(error));
    }
  }

  isDupeCity(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<Record<string, any> | null> => {
      const city = {} as City;
      city.id = this.id ? this.id : 0;
      city.name = this.form.get('name').value;
      city.lat = +this.form.get('lat').value;
      city.lon = +this.form.get('lon').value;
      city.countryId = +this.form.get('countryId').value;

      return this.cityService.isDupeCity(city).pipe(
        map(result => {
          return result ? {isDupeCity: true} : null;
        }));
    };
  }

}
