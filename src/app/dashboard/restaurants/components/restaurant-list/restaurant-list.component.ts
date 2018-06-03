import { Component, OnInit } from '@angular/core';
import { RestaurantsService } from '../../services/restaurants.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { IRestaurantDTO } from '../../dto/restaurant.dto';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { IAddressDTO } from '../../dto/address.dto';
import { ITimeTableDTO } from '../../dto/time-table.dto';
import { ISocialNetworkDTO } from '../../dto/social-network.dto';
import { ESocialNetwork } from '../../enums/social-network.enum';

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.scss']
})
export class RestaurantListComponent implements OnInit {
  isInAddRestaurantMode: boolean;
  restaurantForm: FormGroup;
  addressForm: FormGroup;
  timeTableForm: FormGroup;
  restaurantData: IRestaurantDTO;
  addressData: IAddressDTO;
  timeTableData: ITimeTableDTO;
  socialNetworksData: ISocialNetworkDTO[];

  constructor(private readonly builder: FormBuilder,
              public authenticationService: AuthenticationService,
              public readonly restaurantsService: RestaurantsService) {
    this.isInAddRestaurantMode = false;
    this.restaurantData = {
      id: 0,
      company_id: this.authenticationService.getCurrentUser().companyId,
      name: '',
      phone: '',
      site: ''
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
      restaurant_id: 0,
      from: '',
      to: '',
      until_last_client: false
    };
    this.socialNetworksData = [];
  }

  ngOnInit() {
    this.restaurantForm = this.builder.group({
      name: [this.restaurantData.name, Validators.required],
      phone: [this.restaurantData.phone],
      site: [this.restaurantData.site]
    });
    this.addressForm = this.builder.group({
      city: [this.addressData.city, Validators.required],
      street: [this.addressData.street, Validators.required],
      building_number: [this.addressData.building_number, Validators.required]
    });
    this.timeTableForm = this.builder.group({
      from: [this.timeTableData.from, Validators.required],
      to: [this.timeTableData.to, Validators.required],
      until_last_client: [this.timeTableData.until_last_client, Validators.required]
    });
  }

  openAddRestaurantDialog() {
    this.isInAddRestaurantMode = true;
  }

  closeAddRestaurantDialog() {
    this.isInAddRestaurantMode = false;
  }

  async addRestaurant(): Promise<any> {
    const result = this.restaurantsService.addRestaurant(this.restaurantData, this.authenticationService.getCurrentUser().companyId);
  }

  /**
   * Получение статуса элемента формы редактирования данных о ресторане
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  restaurantFormStatusCtrl(item: string): string {
    if (!this.restaurantForm.controls[item]) { return; }
    const control: AbstractControl = this.restaurantForm.controls[item];
    return control.dirty && control.hasError('required') ? 'invalid' : 'validating';
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
      case 'title':
        return control.dirty && control.hasError('message') ? 'Вы не указали наименование' : '';
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
    return control.dirty && control.hasError('required') ? 'invalid' : 'validating';
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
        return control.dirty && control.hasError('message') ? 'Вы не указали город' : '';
      case 'street':
        return control.dirty && control.hasError('message') ? 'Вы не указали улицу' : '';
      case 'building_number':
        return control.dirty && control.hasError('message') ? 'Вы не указали дом' : '';
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
    return control.dirty && control.hasError('required') ? 'invalid' : 'validating';
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
        return control.dirty && control.hasError('message') ? 'Вы не указали время начала работы' : '';
      case 'to':
        return control.dirty && control.hasError('message') ? 'Вы не указали время окончания работы' : '';
    }
  }

  pushSocialNetwork() {
    this.socialNetworksData.push({
      id: 0,
      restaurant_id: 0,
      network_type: ESocialNetwork.fb,
      url: ''
    });
  }
}
