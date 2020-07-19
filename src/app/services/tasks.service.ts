import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { DexieService } from '../core/dexie.service';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

export interface Task {
  title: string;
  description: string;
  done: boolean;
  from_date: NgbDate;
  to_date: NgbDate;
  updated_at: Date;
}

export interface TaskWithID extends Task {
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  // indexed-db (dexie.js)
  table: Dexie.Table<TaskWithID, number>;
  now = new Date();

  constructor(private dexieService: DexieService) {
    this.table = this.dexieService.table('tasks');
  }

  getAll() {
    return this.table.toArray();
  }

  add(data) {
    return this.table.add(data);
  }

  update(id, data) {
    return this.table.update(id, data);
  }

  remove(id) {
    return this.table.delete(id);
  }

  search(title) {
    return this.table.where('title').startsWithAnyOfIgnoreCase(title).sortBy('id');
  }

}
