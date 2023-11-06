import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResult } from '../models/api-result.interface';

export abstract class BaseService<T> {
  protected constructor(
    protected http: HttpClient,
    protected baseUrl: string
  ) {
  }

  abstract getData(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string): Observable<ApiResult<T>>;

  abstract get(id: number): Observable<T>;

  abstract put(item: T): Observable<T>;

  abstract post(item: T): Observable<T>;


}
