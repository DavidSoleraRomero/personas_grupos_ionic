// src/app/services/impl/base-service.service.ts
import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IBaseService } from '../interfaces/base-service.interface';
import { IBaseRepository } from '../../repositories/intefaces/base-repository.interface';
import { Model } from '../../models/base.model';
import { Paginated } from '../../models/paginated.model';
import { REPOSITORY_TOKEN } from '../../repositories/repository.tokens';

@Injectable({
  providedIn: 'root'
})
export class BaseService<T extends Model> implements IBaseService<T> {
  constructor(
    @Inject(REPOSITORY_TOKEN) protected repository: IBaseRepository<T>
  ) {}

  query(filter: string): Observable<T[]> {
    return this.repository.query(filter);
  }

  getAll(): Observable<T[]>;
  getAll(page: number, pageSize: number): Observable<Paginated<T>>;

  getAll(page:number=-1, pageSize:number=25): Observable<T[]| Paginated<T>> {    
      return this.repository.getAll(page, pageSize);
  }

  getById(id: string): Observable<T> {
    return this.repository.getById(id);
  }

  add(entity: T): Observable<T> {
    return this.repository.add(entity);
  }

  update(id: string, entity: T): Observable<T> {
    return this.repository.update(id, entity);
  }

  delete(id: string): Observable<T> {
    return this.repository.delete(id);
  }
}
