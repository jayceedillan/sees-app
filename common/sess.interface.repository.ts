import { Observable } from 'rxjs';

export interface CrudService<T> {
  loadDataAndSearch(pageNumber: number, query: string): void;
  addData(data: T): Observable<T>;
  // getById(id: number): Observable<T>;

  updateData(data: T): Observable<T>;
  deleteData(id: number): Observable<T>;
}
