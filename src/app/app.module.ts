import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SidenavComponent } from './sidenav/sidenav.component';
import { EmployeeManagementComponent } from './employee-management/employee-management.component';
import { ExcelService } from '../api/excel.service';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    EmployeeManagementComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      progressBar: true,
      autoDismiss: false
    }) // ToastrModule added
  ],
  providers: [ExcelService],
  bootstrap: [AppComponent]
})
export class AppModule { }
