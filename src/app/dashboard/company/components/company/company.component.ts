import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import {FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  isInEditCompanyMode: boolean;
  editCompanyForm: FormGroup;

  constructor(private readonly builder: FormBuilder,
              public readonly companyService: CompanyService) {
    this.isInEditCompanyMode = false;
  }

  ngOnInit() {
    this.editCompanyForm = this.builder.group({
      title: ['', Validators.required],
      phone: ['', Validators.required],
      www: ['', Validators.required]
    });
  }


  openEditCompanyDialog() {
    this.isInEditCompanyMode = true;
  }

  statusCtrl(item: string): string {
    if (!this.editCompanyForm.controls[item]) { return; }
    const control: AbstractControl = this.editCompanyForm.controls[item];
    return control.dirty && control.hasError('status') ? control.errors.status : '';
  }

  messageCtrl(item: string): string {
    if (!this.editCompanyForm.controls[item]) { return; }
    const control: AbstractControl = this.editCompanyForm.controls[item];
    return control.dirty && control.hasError('message') ? control.errors.message : '';
  }
}
