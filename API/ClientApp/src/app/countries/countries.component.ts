import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Country } from '../models/country.interface';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CountryService } from '../services/country.service';

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
    private countryService: CountryService) {
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
    const pageIndex = event.pageIndex;
    const pageSize = event.pageSize;
    const sortColumn= this.sort && this.sort.active ? this.sort.active : this.defaultSortColumn;
    const sortOrder= this.sort && this.sort.direction ? this.sort.direction : this.defaultSortOrder;
    const filterColumn= this.filterQuery ? this.defaultFilterColumn : null;
    const filterQuery= this.filterQuery ? this.filterQuery : null;

    this.countryService.getData(pageIndex, pageSize, sortColumn, sortOrder, filterColumn, filterQuery)
      .subscribe(result => {
        this.paginator.length = result.totalCount;
        this.paginator.pageIndex = result.pageIndex;
        this.paginator.pageSize = result.pageSize;
        this.countries = new MatTableDataSource<Country>(result.data);
      }, error => console.error(error));
  }
}
