import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BASE_URL } from '../_config/app.config';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ApiResult } from '../models/api-result.interface';
import { MatSort } from '@angular/material/sort';
import { Country } from '../models/country.interface';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'name', 'iso2', 'iso3', 'totalCities'];
  public countries: MatTableDataSource<Country>;

  defaultPageIndex = 0;
  defaultPageSize = 10;
  defaultSortColumn = 'name';
  defaultSortOrder = 'asc';

  defaultFilterColumn = 'name';
  filterQuery: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  filterTextChanged = new Subject<void>();

  constructor(
    private http: HttpClient,
    @Inject(BASE_URL) private baseUrl: string) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  onFilterTextChanged(): void {
    if (this.filterTextChanged.observers.length === 0) {
      this.filterTextChanged.pipe(
        debounceTime(1000)
      ).subscribe(() => this.loadData());
    }
    this.filterTextChanged.next();
  }

  loadData(): void {
    const pageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;
    this.getData(pageEvent);
  }

  getData(event: PageEvent): void {
    const url = this.baseUrl + 'Countries';
    let params = new HttpParams()
      .set('pageIndex', event.pageIndex.toString())
      .set('pageSize', event.pageSize.toString())
      .set('sortColumn', this.sort && this.sort.active ? this.sort.active : this.defaultSortColumn)
      .set('sortOrder', this.sort && this.sort.direction ? this.sort.direction : this.defaultSortOrder);

    if (this.filterQuery) {
      params = params.append('filterColumn', this.defaultFilterColumn);
      params = params.append('filterQuery', this.filterQuery);
    }

    this.http.get<ApiResult<Country>>(url, {params})
      .subscribe(result => {
        this.paginator.length = result.totalCount;
        this.paginator.pageIndex = result.pageIndex;
        this.paginator.pageSize = result.pageSize;
        this.countries = new MatTableDataSource<Country>(result.data);
      }, error => console.error(error));
  }
}
