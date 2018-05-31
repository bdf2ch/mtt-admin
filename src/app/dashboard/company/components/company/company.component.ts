import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ICompanyDTO } from '../../dto/company.dto';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { IPaymentRequisitesDTO } from '../../dto/payment-requisites.dto';
import { ElMessageService } from 'element-angular/release/message/message.service';
import { PaymentRequisites } from '../../models/payment-requisites.model';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  isInEditCompanyMode: boolean;
  isInAddPaymentRequisitesMode: boolean;
  isInEditPaymentRequisitesMode: boolean;
  isInDeletePaymentRequisitesMode: boolean;
  editCompanyForm: FormGroup;
  companyData: ICompanyDTO;
  addPaymentRequisitesForm: FormGroup;
  paymentRequisitesData: IPaymentRequisitesDTO;
  selectedPaymentRequisites: PaymentRequisites;

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
    this.isInEditPaymentRequisitesMode = false;
    this.isInDeletePaymentRequisitesMode = false;
    this.paymentRequisitesData = {
      company_id: this.companyService.getCompany().id,
      name: '',
      inn: '',
      kpp: '',
      legal_address: '',
      actual_address: '',
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
      actual_address: [''],
      bank_name: ['', Validators.required],
      checking_account: ['', Validators.required],
      correspondent_account: ['', Validators.required],
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
    console.log('close dialog');
    this.companyData.name = this.companyService.getCompany().title;
    this.companyData.phone = this.companyService.getCompany().phone;
    this.companyData.site = this.companyService.getCompany().www;
    this.isInEditCompanyMode = false;
  }

  /**
   * Получение статуса элемента формы редактирования данных о компании
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  editCompanyFormStatusCtrl(item: string): string {
    if (!this.editCompanyForm.controls[item]) { return; }
    const control: AbstractControl = this.editCompanyForm.controls[item];
    return control.dirty && control.hasError('required') ? 'invalid' : 'validating';
  }

  /**
   * Получение сообщения об ошибке элемента формы изменения данных о компании
   * @param {string} item - Имя элемента формы
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

  /**
   * Открфтие диалогового окна добавления платежный реквизитов
   */
  openAddPaymentRequisitesDialog() {
    this.isInAddPaymentRequisitesMode = true;
    this.addPaymentRequisitesForm.reset({
      name: '',
      inn: '',
      kpp: '',
      legal_address: '',
      actual_address: '',
      bank_name: '',
      checking_account: '',
      correspondent_account: '',
      bik: ''
    });
  }

  /**
   * Закрытие диалогового окна добавления платежных реквизитов
   */
  closeAddPaymentRequisitesDialog() {
    this.isInAddPaymentRequisitesMode = false;
  }

  /**
   * Получение статуса элемента формы добавления платежных реквизитов
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  addPaymentRequisitesFormStatusCtrl(item: string): string {
    if (!this.addPaymentRequisitesForm.controls[item]) { return; }
    const control: AbstractControl = this.addPaymentRequisitesForm.controls[item];
    return control.dirty && control.hasError('required') ? 'error' : 'validating';
  }

  /**
   * Получение сообщения об ошибке элемента формы добавления платежных реквизитов
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  addPaymentRequisitesFormMessageCtrl(item: string): string {
    if (!this.addPaymentRequisitesForm.controls[item]) { return; }
    const control: AbstractControl = this.addPaymentRequisitesForm.controls[item];
    let message = '';
    switch (item) {
      case 'name':
        message =  control.dirty && control.hasError('required') ? 'Вы не указали наименование' : '';
        break;
      case 'inn':
        message =  control.dirty && control.hasError('required') ? 'Вы не указали ИНН' : '';
        break;
      case 'kpp':
        message =  control.dirty && control.hasError('required') ? 'Вы не указали КПП' : '';
        break;
      case 'legal_address':
        message =  control.dirty && control.hasError('required') ? 'Вы не указали юридический адрес' : '';
        break;
      case 'bank_name':
        message =  control.dirty && control.hasError('required') ? 'Вы не указали наименование банка' : '';
        break;
      case 'checking_account':
        message =  control.dirty && control.hasError('required') ? 'Вы не указали расчетный счет' : '';
        break;
      case 'correspondent_account':
        message =  control.dirty && control.hasError('required') ? 'Вы не указали корреспондентский счет' : '';
        break;
      case 'bik':
        message =  control.dirty && control.hasError('required') ? 'Вы не указали БИК' : '';
        break;
    }
    return message;
  }

  /**
   * Добавление платежных реквизитов
   * @returns {Promise<void>}
   */
  async addPaymentRequisites() {
    await this.companyService.addPaymentRequisites(this.paymentRequisitesData, this.authenticationService.getCurrentUser().companyId)
      .then(() => {
        this.closeAddPaymentRequisitesDialog();
        this.message['success']('Платежные реквизиты добавлены');
      });
  }

  /**
   * Открытие диалоговог окна измененияы платежных реквизитов
   * @param {PaymentRequisites} paymentRequisites - Выбранные платежные реквизиты
   */
  openEditPaymentsRequisitesDialog(paymentRequisites: PaymentRequisites) {
    this.selectedPaymentRequisites = paymentRequisites;
    this.isInEditPaymentRequisitesMode = true;
    this.addPaymentRequisitesForm.reset({
      name: paymentRequisites.businessTitle,
      inn: paymentRequisites.INN,
      kpp: paymentRequisites.KPP,
      legal_address: paymentRequisites.businessAddress,
      actual_address: paymentRequisites.address,
      bank_name: paymentRequisites.bankTitle,
      checking_account: paymentRequisites.account,
      correspondent_account: paymentRequisites.correspondingAccount,
      bik: paymentRequisites.BIK
    });
    this.paymentRequisitesData = {
      id: paymentRequisites.id,
      company_id: this.companyService.getCompany().id,
      name: paymentRequisites.businessTitle,
      inn: paymentRequisites.INN,
      kpp: paymentRequisites.KPP,
      legal_address: paymentRequisites.businessAddress,
      actual_address: paymentRequisites.address,
      bank_name: paymentRequisites.bankTitle,
      checking_account: paymentRequisites.account,
      correspondent_account: paymentRequisites.correspondingAccount,
      bik: paymentRequisites.BIK,
      primary: 0
    };
  }

  /**
   * Закрытие диалогового окна изменения платежных реквизитов
   */
  closeEditPaymentRequisitesDialog() {
    this.isInEditPaymentRequisitesMode = false;
  }

  /**
   * Изменение платежных реквизитов
   * @returns {Promise<void>}
   */
  async editPaymentRequisites() {
    await this.companyService.editPaymentRequisites(this.paymentRequisitesData, this.authenticationService.getCurrentUser().companyId)
      .then(() => {
        this.selectedPaymentRequisites.businessTitle = this.paymentRequisitesData.name;
        this.selectedPaymentRequisites.INN = this.paymentRequisitesData.inn;
        this.selectedPaymentRequisites.KPP = this.paymentRequisitesData.kpp;
        this.selectedPaymentRequisites.businessAddress = this.paymentRequisitesData.legal_address;
        this.selectedPaymentRequisites.address = this.paymentRequisitesData.actual_address;
        this.selectedPaymentRequisites.bankTitle = this.paymentRequisitesData.bank_name;
        this.selectedPaymentRequisites.BIK = this.paymentRequisitesData.bik;
        this.closeEditPaymentRequisitesDialog();
        this.message['success']('Платежные реквизиты изменены');
      });
  }

  /**
   * Открытие диалогового окна подстверждения удаления платежных реквизитов
   */
  openDeletePaymentRequisitesDialog(paymentRequisites: PaymentRequisites) {
    this.selectedPaymentRequisites = paymentRequisites;
    this.isInDeletePaymentRequisitesMode = true;
  }

  /**
   * Закрытие диалогового окна подстверждения удаления платежных реквизитов
   */
  closeDeletePaymentRequisitesDialog() {
    this.isInDeletePaymentRequisitesMode = false;
  }

  async deletePaymentRequisites() {
    await this.companyService.deletePaymentRequisites(this.authenticationService.getCurrentUser().companyId, this.selectedPaymentRequisites.id)
      .then(() => {
        this.closeDeletePaymentRequisitesDialog();
        this.message['success']('Платежные реквизиты удалены');
      });
  }
}
