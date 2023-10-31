import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { City } from '../models/city.interface';
import { BASE_URL } from '../_config/app.config';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'name', 'lat', 'lon'];
  public cities: MatTableDataSource<City>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private http: HttpClient,
    @Inject(BASE_URL) private baseUrl: string) {
  }

  ngOnInit(): void {
    this.http.get<City[]>(this.baseUrl + 'Cities')
      .subscribe(result => {
        this.cities = new MatTableDataSource<City>(result);
        this.cities.paginator = this.paginator;
      }, error => console.error(error));
  }
}
