import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResult } from '../models/api-result.interface';

export abstract class BaseService {
  protected constructor(
    protected http: HttpClient,
    protected baseUrl: string
  ) {
  }

  abstract getData<T>(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string): Observable<ApiResult<T>>;

  abstract get<T>(id: number): Observable<T>;

  abstract put<T>(item: T): Observable<T>;

  abstract post<T>(item: T): Observable<T>;


}
