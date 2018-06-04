import { Component, OnInit } from '@angular/core';
import { RestaurantsService } from '../../services/restaurants.service';
import {FormGroup, FormBuilder, Validators, AbstractControl, FormControl} from '@angular/forms';
import { IRestaurantDTO } from '../../dto/restaurant.dto';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { IAddressDTO } from '../../dto/address.dto';
import { ITimeTableDTO } from '../../dto/time-table.dto';
import { ISocialNetworkDTO } from '../../dto/social-network.dto';
import { ESocialNetwork } from '../../enums/social-network.enum';
import {CompanyService} from '../../../company/services/company.service';
import {IRKeeperConfig} from '../../../company/interfaces/r-keeper-config.interface';
import {PaymentRequisites} from '../../../company/models/payment-requisites.model';
import {Restaurant} from '../../models/restaurant.model';
import {ElMessageService} from 'element-angular/release/message/message.service';

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.scss']
})
export class RestaurantListComponent implements OnInit {
  isInAddRestaurantMode: boolean;
  isInDeleteRestaurantMode: boolean;
  selectedRestaurant: Restaurant | null;
  restaurantForm: FormGroup;
  addressForm: FormGroup;
  timeTableForm: FormGroup;
  socialNetworksForm: FormGroup;
  rKeeperForm: FormGroup;
  restaurantData: IRestaurantDTO;
  addressData: IAddressDTO;
  timeTableData: ITimeTableDTO;
  socialNetworksData: ISocialNetworkDTO[];
  rKeeperData: string;

  constructor(private readonly builder: FormBuilder,
              public authenticationService: AuthenticationService,
              public readonly companyService: CompanyService,
              public readonly restaurantsService: RestaurantsService,
              private readonly message: ElMessageService) {
    this.isInAddRestaurantMode = false;
    this.isInDeleteRestaurantMode = false;
    this.selectedRestaurant = null;
    this.restaurantData = {
      id: 0,
      name: '',
      phone: null,
      site: null
    };
    this.addressData = {
      id: 0,
      city: '',
      street: '',
      building_number: '',
      latitude: 0,
      longitude: 0,
      comment: ''
    };
    this.timeTableData = {
      id: 0,
      from: '',
      to: null,
      until_last_client: false
    };
    this.socialNetworksData = [];
    this.rKeeperData = null;
  }

  ngOnInit() {
    const siteRegExp = /^https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,}$/;
    const timeRegExp = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    this.restaurantForm = this.builder.group({
      name: [this.restaurantData.name, Validators.required],
      phone: [this.restaurantData.phone],
      site: [this.restaurantData.site, Validators.pattern(siteRegExp)]
    });
    this.addressForm = this.builder.group({
      city: [this.addressData.city, Validators.required],
      street: [this.addressData.street, Validators.required],
      building_number: [this.addressData.building_number, Validators.required]
    });
    this.timeTableForm = this.builder.group({
      from: [this.timeTableData.from, [Validators.required, Validators.pattern(timeRegExp)]],
      to: [this.timeTableData.to, [Validators.required, Validators.pattern(timeRegExp)]],
      until_last_client: [this.timeTableData.until_last_client, Validators.required]
    });
    this.socialNetworksForm = this.builder.group({});
    this.rKeeperForm = this.builder.group({
      config: [this.restaurantData.r_keeper_config]
    });
  }

  openAddRestaurantDialog() {
    this.restaurantData = {
      id: 0,
      name: '',
      phone: null,
      site: null
    };
    this.timeTableData = {
      id: 0,
      from: '',
      to: null,
      until_last_client: false
    };
    this.isInAddRestaurantMode = true;
    if (!this.companyService.getCompany().rKeeperConfig) {
      console.log('Company has no R-Keeper config');
      this.rKeeperForm.get('config').setValidators(Validators.required);
    } else {
      this.rKeeperForm.get('config').clearValidators();
    }
  }

  closeAddRestaurantDialog() {
    this.isInAddRestaurantMode = false;
  }

  async addRestaurant(): Promise<any> {
    if (!this.restaurantData.phone) {
      delete this.restaurantData.phone;
    }
    if (!this.restaurantData.site) {
      delete this.restaurantData.site;
    } else {
      this.restaurantData.site = this.restaurantData.site.indexOf('http') === -1 ? 'http://' + this.restaurantData.site : '';
    }
    if (this.timeTableData.until_last_client) {
      delete this.timeTableData.to;
    }
    if (!this.restaurantData.r_keeper_config && this.companyService.getCompany().rKeeperConfig) {
      this.restaurantData.r_keeper_config = this.companyService.getCompany().rKeeperConfig;
    }
    const rest = await this.restaurantsService.addRestaurant(this.restaurantData, this.authenticationService.getCurrentUser().companyId);
    const time = await this.restaurantsService.addTimeTable(this.timeTableData, rest.id);
  }

  /**
   * Получение статуса элемента формы редактирования данных о ресторане
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  restaurantFormStatusCtrl(item: string): string {
    if (!this.restaurantForm.controls[item]) { return; }
    const control: AbstractControl = this.restaurantForm.controls[item];
    return control.dirty && control.hasError('required') || control.hasError('pattern') ? 'error' : 'validating';
  }

  /**
   * Получение сообщения об ошибке элемента формы изменения данных о ресторане
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  restaurantFormMessageCtrl(item: string): string {
    if (!this.restaurantForm.controls[item]) { return; }
    const control: AbstractControl = this.restaurantForm.controls[item];
    switch (item) {
      case 'name':
        return control.dirty && control.hasError('required') ? 'Вы не указали наименование' : '';
      case 'site':
        return control.dirty && control.hasError('pattern') ? 'Адрес сайта указан некорректно' : '';
    }
  }

  /**
   * Получение статуса элемента формы редактирования данных об адреме ресторана
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  addressFormStatusCtrl(item: string): string {
    if (!this.addressForm.controls[item]) { return; }
    const control: AbstractControl = this.addressForm.controls[item];
    return control.dirty && control.hasError('required') ? 'error' : 'validating';
  }

  /**
   * Получение сообщения об ошибке элемента формы изменения данных о ресторане
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  addressFormMessageCtrl(item: string): string {
    if (!this.addressForm.controls[item]) { return; }
    const control: AbstractControl = this.addressForm.controls[item];
    switch (item) {
      case 'city':
        return control.dirty && control.hasError('required') ? 'Вы не указали город' : '';
      case 'street':
        return control.dirty && control.hasError('required') ? 'Вы не указали улицу' : '';
      case 'building_number':
        return control.dirty && control.hasError('required') ? 'Вы не указали дом' : '';
    }
  }

  /**
   * Получение статуса элемента формы редактирования данных о времени работы ресторана
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  timeTableFormStatusCtrl(item: string): string {
    if (!this.timeTableForm.controls[item]) { return; }
    const control: AbstractControl = this.timeTableForm.controls[item];
    return control.dirty && control.hasError('required') || control.hasError('pattern') ? 'error' : 'validating';
  }

  /**
   * Получение сообщения об ошибке элемента формы изменения данных о времени работы ресторане
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  timeTableFormMessageCtrl(item: string): string {
    if (!this.timeTableForm.controls[item]) { return; }
    const control: AbstractControl = this.timeTableForm.controls[item];
    switch (item) {
      case 'from':
        return control.dirty && control.hasError('required') ? 'Вы не указали время начала работы' : control.hasError('pattern') ? 'Время начала работы должно быть в формате ЧЧ:ММ' : '';
      case 'to':
        return control.dirty && control.hasError('required') ? 'Вы не указали время окончания работы' : control.hasError('pattern') ? 'Время начала работы должно быть в формате ЧЧ:ММ' : '';
    }
  }

  /**
   * Получение статуса элемента формы социальных сетей ресторана
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  socialNetworksFormStatusCtrl(item: string): string {
    if (!this.socialNetworksForm.controls[item]) { return; }
    const control: AbstractControl = this.socialNetworksForm.controls[item];
    return control.dirty && control.hasError('required') || control.hasError('pattern') ? 'error' : 'validating';
  }

  /**
   * Получение сообщения об ошибке элемента формы социальных сетей ресторана
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  socialNetworksFormMessageCtrl(item: string): string {
    if (!this.socialNetworksForm.controls[item]) { return; }
    const control: AbstractControl = this.socialNetworksForm.controls[item];
    switch (item) {
      default:
        return control.dirty && control.hasError('required') ? 'Вы не указали адрес в соц. сети' : control.hasError('pattern') ? 'Вы указали адрес в соц. сети некорректно' : '';
    }
  }

  /**
   * Получение статуса элемента формы конфигурации R-Keeper
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  rKeeperFormStatusCtrl(item: string): string {
    if (!this.rKeeperForm.controls[item]) { return; }
    const control: AbstractControl = this.rKeeperForm.controls[item];
    return control.dirty && control.hasError('required') ? 'error' : 'validating';
  }

  /**
   * Получение сообщения об ошибке элемента формы конфигурации R-Keeper
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  rKeeperFormMessageCtrl(item: string): string {
    if (!this.rKeeperForm.controls[item]) { return; }
    const control: AbstractControl = this.rKeeperForm.controls[item];
    switch (item) {
      case 'config':
        return control.dirty && control.hasError('required') ? 'Вы не указали конфигурацию R-Keeper' : '';
    }
  }

  onChangeUntilLastClient(value: boolean) {
    console.log(value);
    //this.timeTableData.to = null;
    //this.timeTableForm.get('to').setValue(null);
    if (value) {
      this.timeTableForm.get('to').clearValidators();
      this.timeTableForm.get('to').reset();
    } else {
      const timeRegExp = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
      this.timeTableForm.get('to').setValidators([Validators.required, Validators.pattern(timeRegExp)]);
      this.timeTableForm.get('to').reset();
    }
    console.log(this.timeTableForm.status);
    console.log(this.timeTableForm.get('to'));
  }

  appendSocialNetwork() {
    const network = {
      id: 0,
      restaurant_id: 0,
      network_type: this.restaurantsService.getSocialNetworkTypes()[0].id,
      url: '',
      timeCreated: new Date().getTime()
    };
    console.log(network);
    const siteRegExp = /^https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,}$/;
    this.socialNetworksForm.addControl(
      `socialNetworkType${network.timeCreated}`,
      new FormControl('', [Validators.required])
    );
    this.socialNetworksForm.addControl(
      `socialNetworkUrl${network.timeCreated}`,
      new FormControl('', [Validators.required, Validators.pattern(siteRegExp)])
    );
    this.socialNetworksData.push(network);
    console.log(this.socialNetworksForm);
  }


  /**
   * Открытие диалогового окна подстверждения удаления ресторана
   */
  openDeleteRestaurantDialog(restaurant: Restaurant) {
    console.log(restaurant);
    this.selectedRestaurant = restaurant;
    this.isInDeleteRestaurantMode = true;
  }

  /**
   * Закрытие диалогового окна подстверждения удаления ресторана
   */
  closeDeleteRestaurantDialog() {
    this.isInDeleteRestaurantMode = false;
  }

  /**
   * Удаление ресторана
   * @returns {Promise<void>}
   */
  async deleteRestaurant() {
    await this.restaurantsService.deleteRestaurant(this.authenticationService.getCurrentUser().companyId, this.selectedRestaurant.id)
      .then(() => {
        this.closeDeleteRestaurantDialog();
        this.message['success']('Ресторан удален');
      });
  }
}
