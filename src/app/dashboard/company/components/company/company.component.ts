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
    const siteRegExp = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]!\$&'\(\)\*\+,;=.]+$/;
    this.editCompanyForm = this.builder.group({
      title: [this.companyData.name, Validators.required],
      phone: [this.companyData.phone],
      www: [this.companyData.site, Validators.pattern(siteRegExp)]
      // r_keeper_config: [this.companyData.r_keeper_config]
    });
    const INNRegExp = /^[0-9]{10}$|^[0-9]{12}$/;
    const KPPRegExp = /^[0-9]{9}$/;
    const accountRegExp = /^[0-9]{20}$/;
    const BIKRegExp = /^[0-9]{9}$/;
    this.addPaymentRequisitesForm = this.builder.group({
      name: ['', Validators.required],
      inn: ['', [Validators.required, Validators.pattern(INNRegExp)]],
      kpp: ['', [Validators.required, Validators.pattern(KPPRegExp)]],
      legal_address: ['', Validators.required],
      actual_address: [''],
      bank_name: ['', Validators.required],
      checking_account: ['', [Validators.required, Validators.pattern(accountRegExp)]],
      correspondent_account: ['', [Validators.required, Validators.pattern(accountRegExp)]],
      bik: ['', [Validators.required, Validators.pattern(BIKRegExp)]]
    });
  }


  /**
   * Открытие диалогового окна изменения данных компании
   */
  openEditCompanyDialog() {
    this.companyData.name = this.companyService.getCompany().title;
    this.companyData.phone = this.companyService.getCompany().phone;
    this.companyData.site = this.companyService.getCompany().www;
    // this.companyData.r_keeper_config = this.companyService.getCompany().rKeeperConfig;
    this.isInEditCompanyMode = true;
  }

  /**
   * Закрытие диалогового окна изменения данных о компании
   */
  closeEditCompanyDialog() {
    this.companyData.name = this.companyService.getCompany().title;
    this.companyData.phone = this.companyService.getCompany().phone;
    this.companyData.site = this.companyService.getCompany().www;
    // this.companyData.r_keeper_config = this.companyService.getCompany().rKeeperConfig;
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
    return control.dirty && control.hasError('required') || control.hasError('pattern') ? 'error' : 'validating';
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
      case 'www':
        return control.dirty && control.hasError('pattern') ? 'Адрес сайта указан некорректно' : '';
    }
  }

  /**
   * Отправка данных о компании на сервер
   * @returns {Promise<void>}
   */
  async editCompany() {
    if (this.companyData.site.indexOf('http') === -1) {
      this.companyData.site = 'http://' + this.companyData.site;
    }
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
    this.addPaymentRequisitesForm.get('actual_address').clearValidators();
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
    const c: AbstractControl = this.addPaymentRequisitesForm.controls[item];
    return c.dirty && (c.hasError('required') ||
      c.hasError('minlength') ||
      c.hasError('maxlength')) ||
    c.hasError('pattern') ? 'error' : 'validating';
  }

  /**
   * Получение сообщения об ошибке элемента формы добавления платежных реквизитов
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  addPaymentRequisitesFormMessageCtrl(item: string): string {
    if (!this.addPaymentRequisitesForm.controls[item]) { return; }
    const c: AbstractControl = this.addPaymentRequisitesForm.controls[item];
    let message = '';
    switch (item) {
      case 'name':
        message =  c.dirty && c.hasError('required') ? 'Вы не указали наименование' : '';
        break;
      case 'inn':
        message =  c.dirty && c.hasError('required')
          ? 'Вы не указали ИНН' : c.hasError('pattern')
            ? 'ИНН должен содержать 10 или 12 символов' : '';
        break;
      case 'kpp':
        message =  c.dirty && c.hasError('required')
          ? 'Вы не указали КПП' : c.hasError('pattern')
            ? 'КПП должен содержать 9 символов' : '';
        break;
      case 'legal_address':
        message =  c.dirty && c.hasError('required') ? 'Вы не указали юридический адрес' : '';
        break;
      case 'actual_address':
        message =  c.dirty && c.hasError('required') ? 'Вы не указали физический адрес' : '';
        break;
      case 'bank_name':
        message =  c.dirty && c.hasError('required') ? 'Вы не указали наименование банка' : '';
        break;
      case 'checking_account':
        message =  c.dirty && c.hasError('required')
          ? 'Вы не указали расчетный счет' : c.hasError('pattern')
            ? 'Расчетный счет должен содержать 20 символов' : '';
        break;
      case 'correspondent_account':
        message =  c.dirty && c.hasError('required')
          ? 'Вы не указали корреспондентский счет' : c.hasError('pattern')
            ? 'Корреспондентсикй счет должен содержать 20 символов' : '';
        break;
      case 'bik':
        message =  c.dirty && c.hasError('required')
          ? 'Вы не указали БИК' : c.hasError('pattern')
            ? 'БИК должен состоять из 9 символов' : '';
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
    this.addPaymentRequisitesForm.get('actual_address').setValidators(Validators.required);
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
    await this.companyService.deletePaymentRequisites(
      this.authenticationService.getCurrentUser().companyId,
      this.selectedPaymentRequisites.id)
      .then(() => {
        this.closeDeletePaymentRequisitesDialog();
        this.message['success']('Платежные реквизиты удалены');
      });
  }
}
