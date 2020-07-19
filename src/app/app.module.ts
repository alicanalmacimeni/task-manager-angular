import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodayComponent } from './today/today.component';
import { DefaultLayoutComponent } from './default-layout/default-layout.component';
import { DexieService } from './core/dexie.service';
import { CoreModule } from './core/core.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';  
import { FormsModule } from '@angular/forms';
import { TaskListComponent } from './task-list/task-list.component';


@NgModule({
  declarations: [
    AppComponent,
    TodayComponent,
    DefaultLayoutComponent,
    TaskListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    NgbModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [
    DexieService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
