import { Inject, Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BASE_URL } from '../_config/app.config';
import { Observable } from 'rxjs';
import { ApiResult } from '../models/api-result.interface'
import { Country } from '../models/country.interface';

@Injectable({
  providedIn: 'root'
})
export class CountryService extends BaseService<Country> {

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
          filterQuery: string): Observable<ApiResult<Country>> {
    const url = this.baseUrl + 'Countries';
    let params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString())
      .set('sortColumn', sortColumn)
      .set('sortOrder', sortOrder);

    if (filterQuery) {
      params = params.append('filterColumn', filterColumn);
      params = params.append('filterQuery', filterQuery);
    }
    return this.http.get<ApiResult<Country>>(url, {params});
  }

  getAllCountries(): Observable<ApiResult<Country>> {
    const url = this.baseUrl + 'Countries';
    let params = new HttpParams()
      .set('pageIndex', '0')
      .set('pageSize', '9999')
      .set('sortColumn', 'name');
    return this.http.get<ApiResult<Country>>(url, {params});
  }

  get(id: number): Observable<Country> {
    const url = this.baseUrl + "Countries/" + id;
    return this.http.get<Country>(url);
  }

  post(item: Country): Observable<Country> {
    const url = this.baseUrl + "Countries/" + item.id;
    return this.http.put<Country>(url, item);
  }

  put(item: Country): Observable<Country> {
    const url = this.baseUrl + "Countries";
    return this.http.post<Country>(url, item);
  }

  isDupeField(countryId: string, fieldName: string, fieldValue: string): Observable<boolean> {
    const params = new HttpParams()
      .set("countryId", countryId)
      .set("fieldName", fieldName)
      .set("fieldValue", fieldValue);
    const url = this.baseUrl + "Countries/IsDupeField";
    return this.http.post<boolean>(url, null, { params });
  }

}
