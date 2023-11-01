import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { City } from '../models/city.interface';
import { BASE_URL } from '../_config/app.config';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ApiResult } from '../models/api-result.interface';
import { MatSort } from '@angular/material/sort';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'name', 'lat', 'lon'];
  public cities: MatTableDataSource<City>;

  defaultPageIndex = 0;
  defaultPageSize = 10;
  defaultSortColumn = 'name';
  defaultSortOrder = 'asc';

  defaultFilterColumn = 'name';
  filterQuery: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private http: HttpClient,
    @Inject(BASE_URL) private baseUrl: string) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const pageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;
    this.getData(pageEvent);
  }

  getData(event: PageEvent): void {
    const url = this.baseUrl + 'Cities';
    let params = new HttpParams()
      .set('pageIndex', event.pageIndex.toString())
      .set('pageSize', event.pageSize.toString())
      .set('sortColumn', this.sort && this.sort.active ? this.sort.active : this.defaultSortColumn)
      .set('sortOrder', this.sort && this.sort.direction ? this.sort.direction : this.defaultSortOrder);

    if (this.filterQuery) {
      params = params.append('filterColumn', this.defaultFilterColumn);
      params = params.append('filterQuery', this.filterQuery);
    }

    this.http.get<ApiResult<City>>(url, {params})
      .subscribe(result => {
        this.paginator.length = result.totalCount;
        this.paginator.pageIndex = result.pageIndex;
        this.paginator.pageSize = result.pageSize;
        this.cities = new MatTableDataSource<City>(result.data);
      }, error => console.error(error));
  }
}
