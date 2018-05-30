import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ICompany } from '../../interfaces/company.interface';
import { ICompanyDTO } from '../../dto/company.dto';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { IPaymentRequisitesDTO } from '../../dto/payment-requisites.dto';
import { ElMessageService } from 'element-angular/release/message/message.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  isInEditCompanyMode: boolean;
  isInAddPaymentRequisitesMode: boolean;
  editCompanyForm: FormGroup;
  companyData: ICompanyDTO;
  addPaymentRequisitesForm: FormGroup;
  newPaymentRequisitesData: IPaymentRequisitesDTO;

  constructor(private readonly builder: FormBuilder,
              private readonly authenticationService: AuthenticationService,
              public readonly companyService: CompanyService,
              private readonly message: ElMessageService) {
    this.isInEditCompanyMode = false;
    this.companyData = {
      id: this.authenticationService.getCurrentUser().companyId,
      name: this.companyService.getCompany().title,
      phone: this.companyService.getCompany().phone,
      site: this.companyService.getCompany().www
    };

    this.isInAddPaymentRequisitesMode = false;
    this.newPaymentRequisitesData = {
      company_id: this.companyService.getCompany().id,
      name: '',
      inn: '',
      kpp: '',
      legal_address: '',
      bank_name: '',
      checking_account: '',
      correspondent_account: '',
      bik: '',
      primary: 0
    };
  }

  ngOnInit() {
    this.editCompanyForm = this.builder.group({
      title: [this.companyData.name, Validators.required],
      phone: [this.companyData.phone],
      www: [this.companyData.site]
    });

    this.addPaymentRequisitesForm = this.builder.group({
      name: ['', Validators.required],
      inn: ['', Validators.required],
      kpp: ['', Validators.required],
      legal_address: ['', Validators.required],
      bank_name: ['', Validators.required],
      checking_account: ['', Validators.required],
      corresponding_account: ['', Validators.required],
      bik: ['', Validators.required]
    });
  }


  /**
   * Открытие диалогового окна изменения данных компании
   */
  openEditCompanyDialog() {
    this.companyData.name = this.companyService.getCompany().title;
    this.companyData.phone = this.companyService.getCompany().phone;
    this.companyData.site = this.companyService.getCompany().www;
    this.isInEditCompanyMode = true;
  }

  /**
   * Закрытие диалогового окна изменения данных о компании
   */
  closeEditCompanyDialog() {
    this.companyData.name = this.companyService.getCompany().title;
    this.companyData.phone = this.companyService.getCompany().phone;
    this.companyData.site = this.companyService.getCompany().www;
    this.isInEditCompanyMode = false;
  }

  /**
   * Получение статуса элемента формы редактирования данных о компании
   * @param {string} item - Имя Элемента формы
   * @returns {string}
   */
  editCompanyFormStatusCtrl(item: string): string {
    if (!this.editCompanyForm.controls[item]) { return; }
    const control: AbstractControl = this.editCompanyForm.controls[item];
    return control.dirty && control.hasError('required') ? 'invalid' : 'validating';
  }

  /**
   * Получение сообщения об ошибке элемента формы изменения данных о компании
   * @param {string} item - Имя элмента формы
   * @returns {string}
   */
  editCompanyFormMessageCtrl(item: string): string {
    if (!this.editCompanyForm.controls[item]) { return; }
    const control: AbstractControl = this.editCompanyForm.controls[item];
    switch (item) {
      case 'title':
        return control.dirty && control.hasError('message') ? 'Вы не указали наименование' : '';
    }
  }

  /**
   * Отправка данных о компании на сервер
   * @returns {Promise<void>}
   */
  async editCompany() {
    await this.companyService.editCompanyById(this.companyData).then(() => {
      this.closeEditCompanyDialog();
      this.editCompanyForm.reset({
        title: this.companyService.getCompany().title,
        phone: this.companyService.getCompany().phone,
        www: this.companyService.getCompany().www
      });
      this.message['success']('Информация о компании изменена');
    });
  }

  openAddPaymentRequisitesDialog() {
    this.isInAddPaymentRequisitesMode = true;
  }

  closeAddPaymentRequisitesDialog() {
    this.isInAddPaymentRequisitesMode = false;
  }

  /**
   * Получение статуса элемента формы добавления платежных реквизитов
   * @param {string} item - Имя Элемента формы
   * @returns {string}
   */
  addPaymentRequisitesFormStatusCtrl(item: string): string {
    if (!this.addPaymentRequisitesForm.controls[item]) { return; }
    const control: AbstractControl = this.addPaymentRequisitesForm.controls[item];
    return control.dirty && control.hasError('required') ? 'invalid' : 'validating';
  }

  /**
   * Получение сообщения об ошибке элемента формы добавления платежных реквизитов
   * @param {string} item - Имя элмента формы
   * @returns {string}
   */
  addPaymentRequisitesFormMessageCtrl(item: string): string {
    if (!this.addPaymentRequisitesForm.controls[item]) { return; }
    const control: AbstractControl = this.addPaymentRequisitesForm.controls[item];
    switch (item) {
      case 'title':
        return control.dirty && control.hasError('message') ? 'Вы не указали наименование' : '';
    }
  }
}
