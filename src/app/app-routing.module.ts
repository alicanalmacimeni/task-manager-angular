import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TodayComponent } from './today/today.component';
import { DefaultLayoutComponent } from './default-layout/default-layout.component';
import { TaskListComponent } from './task-list/task-list.component';

const routes: Routes = [
  {
    path: '', component: DefaultLayoutComponent, children: [
      { path: '', component: TodayComponent, pathMatch: 'full' },
      { path: 'task-list', component: TaskListComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
