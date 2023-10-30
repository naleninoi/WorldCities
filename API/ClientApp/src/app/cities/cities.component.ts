import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { City } from '../models/city.interface';
import { BASE_URL } from '../_config/app.config';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent implements OnInit {
  public cities: City[];

  constructor(
    private http: HttpClient,
    @Inject(BASE_URL) private baseUrl: string) {
  }

  ngOnInit(): void {
    this.http.get<City[]>(this.baseUrl + 'Cities')
      .subscribe(result => {
        this.cities = result;
      }, error => console.error(error));
  }
}
