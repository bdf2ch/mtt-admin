import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ElModule } from 'element-angular';
import { CompanyComponent } from './components/company/company.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ElModule
  ],
  declarations: [
    CompanyComponent
  ],
  exports: [
    CompanyComponent
  ]
})
export class CompanyModule { }
