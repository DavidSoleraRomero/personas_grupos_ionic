// src/app/services/interfaces/people.service.interface.ts
import { Observable } from 'rxjs';
import { Group } from '../../models/group.model';
import { IBaseService } from './base-service.interface';

export interface IGroupsService extends IBaseService<Group> {
  // Métodos específicos si los hay
  query(filter: string): Observable<Group[]>
}
