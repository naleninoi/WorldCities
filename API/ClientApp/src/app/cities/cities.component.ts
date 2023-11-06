import { Component, OnInit, ViewChild } from '@angular/core';
import { City } from '../models/city.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CityService } from '../services/city.service';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'name', 'lat', 'lon', 'countryName'];
  public cities: MatTableDataSource<City>;

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
    private cityService: CityService) {
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

    this.cityService.getData(pageIndex, pageSize, sortColumn, sortOrder, filterColumn, filterQuery)
      .subscribe(result => {
        this.paginator.length = result.totalCount;
        this.paginator.pageIndex = result.pageIndex;
        this.paginator.pageSize = result.pageSize;
        this.cities = new MatTableDataSource<City>(result.data);
      }, error => console.error(error));
  }
}
