import { Inject, Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BASE_URL } from '../_config/app.config';
import { Observable } from 'rxjs';
import { ApiResult } from '../models/api-result.interface'
import { City } from '../models/city.interface';

@Injectable({
  providedIn: 'root'
})
export class CityService extends BaseService<City> {

  constructor(
    http: HttpClient,
    @Inject(BASE_URL) baseUrl: string) {
    super(http, baseUrl);
  }

  getData(pageIndex: number,
                pageSize: number,
                sortColumn: string,
                sortOrder: string,
                filterColumn: string,
                filterQuery: string): Observable<ApiResult<City>> {
    const url = this.baseUrl + 'Cities';
    let params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString())
      .set('sortColumn', sortColumn)
      .set('sortOrder', sortOrder);

    if (filterQuery) {
      params = params.append('filterColumn', filterColumn);
      params = params.append('filterQuery', filterQuery);
    }
    return this.http.get<ApiResult<City>>(url, {params});
  }

  get(id: number): Observable<City> {
    const url = this.baseUrl + "Cities/" + id;
    return this.http.get<City>(url);
  }

  post(item: City): Observable<City> {
    const url = this.baseUrl + "Cities/" + item.id;
    return this.http.put<City>(url, item);
  }

  put(item: City): Observable<City> {
    const url = this.baseUrl + "Cities";
    return this.http.post<City>(url, item);
  }

  isDupeCity(item: City): Observable<boolean> {
    const url = this.baseUrl + "Cities/IsDupeCity";
    return this.http.post<boolean>(url, item);
  }

}
