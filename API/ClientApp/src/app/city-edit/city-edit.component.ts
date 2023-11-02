import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { City } from '../models/city.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BASE_URL } from '../_config/app.config';
import { Country } from '../models/country.interface';
import { ApiResult } from '../models/api-result.interface';

@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.css']
})
export class CityEditComponent implements OnInit {

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
    private http: HttpClient,
    @Inject(BASE_URL) private baseurl: string
  ) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(''),
      lat: new FormControl(''),
      lon: new FormControl(''),
      countryId: new FormControl('')
    });
    this.loadData();
  }

  loadData(): void {
    // load countries
    this.loadCountries();

    this.id = +this.activatedRoute.snapshot.paramMap.get('id');
    // EDIT MODE
    if (this.id) {
      const url = this.baseurl + 'Cities/' + this.id;
      this.http.get<City>(url).subscribe(result => {
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
    const url = this.baseurl + 'Countries';
    const params = new HttpParams()
      .set('pageIndex', '0')
      .set('pageSize', '9999')
      .set('sortColumn', 'name');
    this.http.get<ApiResult<Country>>(url, {params})
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
      const url = this.baseurl + 'Cities/' + this.id;
      this.http.put<City>(url, city).subscribe(result => {
          console.log(`City with id ${this.city.id} has been updated.`);
          this.router.navigateByUrl('/cities');
        },
        error => console.error(error));
      // CREATE MODE
    } else {
      const url = this.baseurl + 'Cities';
      this.http.post<City>(url, city).subscribe(result => {
          console.log(`City with id ${result.id} has been created.`);
          this.router.navigateByUrl('/cities');
        },
        error => console.error(error));
    }
  }

}
