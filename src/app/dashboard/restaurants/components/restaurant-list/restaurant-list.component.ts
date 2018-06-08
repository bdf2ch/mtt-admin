import { Component, OnInit } from '@angular/core';
import { RestaurantsService } from '../../services/restaurants.service';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { IRestaurantDTO } from '../../dto/restaurant.dto';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { IAddressDTO } from '../../dto/address.dto';
import { ITimeTableDTO } from '../../dto/time-table.dto';
import { ISocialNetworkDTO } from '../../dto/social-network.dto';
import { CompanyService } from '../../../company/services/company.service';
import { Restaurant } from '../../models/restaurant.model';
import { ElMessageService } from 'element-angular/release/message/message.service';
import { SocialNetwork } from '../../models/social-network.model';

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.scss']
})
export class RestaurantListComponent implements OnInit {
  isInAddRestaurantMode: boolean;
  isInEditRestaurantMode: boolean;
  isInDeleteRestaurantMode: boolean;
  selectedRestaurant: Restaurant | null;
  restaurantForm: FormGroup;
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
      site: [this.restaurantData.site, Validators.pattern(siteRegExp)],
      city: [this.addressData.city, Validators.required],
      street: [this.addressData.street, Validators.required],
      building_number: [this.addressData.building_number, Validators.required],
      from: [this.timeTableData.from, [Validators.required, Validators.pattern(timeRegExp)]],
      to: [this.timeTableData.to, [Validators.required, Validators.pattern(timeRegExp)]],
      until_last_client: [this.timeTableData.until_last_client],
      config: [this.restaurantData.r_keeper_config]
    });
  }

  /**
   * Открытие диалогового окна добавления нового ресторана
   */
  openAddRestaurantDialog() {
    this.restaurantData = {
      id: 0,
      name: '',
      phone: null,
      site: null,
      r_keeper_config: null,
    };
    this.addressData = {
      city: '',
      street: '',
      building_number: '',
      latitude: 0,
      longitude: 0
    };
    this.timeTableData = {
      id: 0,
      from: '',
      to: null,
      until_last_client: false
    };
    for (const item in this.restaurantForm.controls) {
      if (item.indexOf('socialNetwork') !== -1) {
        this.restaurantForm.removeControl(item);
      }
    }
    this.socialNetworksData = [];
    if (!this.companyService.getCompany().rKeeperConfig) {
      this.restaurantForm.get('config').setValidators(Validators.required);
    } else {
      this.restaurantForm.get('config').clearValidators();
    }
    this.restaurantForm.get('config').updateValueAndValidity();
    this.restaurantForm.updateValueAndValidity();
    this.isInAddRestaurantMode = true;
  }

  /**
   * Закрытие диалогового окна добавление нового ресторана
   */
  closeAddRestaurantDialog() {
    this.isInAddRestaurantMode = false;
  }

  /**
   * Добавление нового ресторана
   * @returns {Promise<any>}
   */
  async addRestaurant() {
    if (!this.restaurantData.phone) {
      delete this.restaurantData.phone;
    }
    if (!this.restaurantData.site) {
      delete this.restaurantData.site;
    } else {
      this.restaurantData.site = this.restaurantData.site.indexOf('http') === -1
        ? 'http://' + this.restaurantData.site
        : this.restaurantData.site;
    }
    if (this.timeTableData.until_last_client) {
      delete this.timeTableData.to;
    }
    if (!this.restaurantData.r_keeper_config && this.companyService.getCompany().rKeeperConfig) {
      this.restaurantData.r_keeper_config = this.companyService.getCompany().rKeeperConfig;
    }
    this.socialNetworksData.forEach(async (item: ISocialNetworkDTO) => {
      item.url = item.url.indexOf('http') === -1 ? 'http://' + item.url : item.url;
    });
    await this.restaurantsService.addRestaurant(
      this.authenticationService.getCurrentUser().companyId,
      this.restaurantData,
      this.addressData,
      this.timeTableData,
      this.socialNetworksData
    );
    this.closeAddRestaurantDialog();
    this.message['success']('Ресторан добавлен');
  }

  /**
   * Открытие диалогового окна изменения данных о ресторане
   * @param {Restaurant} restaurant - Ресторан
   */
  openEditRestaurantDialog(restaurant: Restaurant) {
    this.selectedRestaurant = restaurant;
    this.restaurantData.id = restaurant.id;
    this.restaurantData.name = restaurant.title;
    this.restaurantData.phone = restaurant.phone;
    this.restaurantData.site = restaurant.www;
    this.restaurantData.r_keeper_config = JSON.stringify(restaurant.rKeeperConfig);
    this.addressData.id = restaurant.address.id;
    this.addressData.city = restaurant.address.city;
    this.addressData.street = restaurant.address.street;
    this.addressData.building_number = restaurant.address.building;
    this.timeTableData.id = restaurant.timeTable.id;
    this.timeTableData.from = restaurant.timeTable.opening;
    this.timeTableData.to = restaurant.timeTable.closing;
    this.timeTableData.until_last_client = restaurant.timeTable.untilLastClient;
    this.socialNetworksData = [];
    for (const item in this.restaurantForm.controls) {
      if (item.indexOf('socialNetwork') !== -1) {
        this.restaurantForm.removeControl(item);
      }
    }
    const siteRegExp = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]!\$&'\(\)\*\+,;=.]+$/;
    restaurant.social.forEach((item: SocialNetwork) => {
      const social: ISocialNetworkDTO = {
        id: item.id,
        restaurant_id: restaurant.id,
        network_type: item.type,
        url: item.url
      };
      this.restaurantForm.addControl(`socialNetworkType${social.id}`, new FormControl(''));
      this.restaurantForm.addControl(
        `socialNetworkUrl${social.id}`,
        new FormControl('', [Validators.required, Validators.pattern(siteRegExp)])
      );
      this.restaurantForm.get(`socialNetworkType${social.id}`).reset(social.network_type);
      this.restaurantForm.get(`socialNetworkUrl${social.id}`).reset(social.url);
      this.socialNetworksData.push(social);
    });
    this.restaurantForm.reset({
      id: this.restaurantData.id,
      name: this.restaurantData.name,
      phone: this.restaurantData.phone,
      site: this.restaurantData.site,
      city: this.addressData.city,
      street: this.addressData.street,
      building_number: this.addressData.building_number,
      from: this.timeTableData.from,
      to: this.timeTableData.to,
      until_last_client: this.timeTableData.until_last_client
    });
    this.socialNetworksData.forEach((item: ISocialNetworkDTO) => {
      this.restaurantForm.get(`socialNetworkType${item.id}`).reset(item.network_type);
      this.restaurantForm.get(`socialNetworkUrl${item.id}`).reset(item.url);
    });
    this.isInEditRestaurantMode = true;
  }

  /**
   * Закрытие диалогового окна изменения даных о ресторане
   */
  closeEditRestaurantDialog() {
    this.isInEditRestaurantMode = false;
    this.selectedRestaurant = null;
  }

  /**
   * Изменение ресторана
   * @returns {Promise<void>}
   */
  async editRestaurant() {
    if (!this.restaurantData.phone) {
      delete this.restaurantData.phone;
    }
    if (!this.restaurantData.site) {
      delete this.restaurantData.site;
    } else {
      this.restaurantData.site = this.restaurantData.site.indexOf('http') === -1
        ? 'http://' + this.restaurantData.site
        : this.restaurantData.site;
    }
    if (this.timeTableData.until_last_client) {
      delete this.timeTableData.to;
    }
    if (!this.restaurantData.r_keeper_config && this.companyService.getCompany().rKeeperConfig) {
      this.restaurantData.r_keeper_config = this.companyService.getCompany().rKeeperConfig;
    }
    this.socialNetworksData.forEach(async (item: ISocialNetworkDTO) => {
      item.url = item.url.indexOf('http') === -1 ? 'http://' + item.url : item.url;
    });
    await this.restaurantsService.editRestaurant(
      this.authenticationService.getCurrentUser().companyId,
      this.restaurantData,
      this.addressData,
      this.timeTableData,
      this.socialNetworksData
    );
    this.closeEditRestaurantDialog();
    this.message['success']('Ресторан изменен');
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
      case 'city':
        return control.dirty && control.hasError('required') ? 'Вы не указали город' : '';
      case 'street':
        return control.dirty && control.hasError('required') ? 'Вы не указали улицу' : '';
      case 'building_number':
        return control.dirty && control.hasError('required') ? 'Вы не указали дом' : '';
      case 'from':
        return control.dirty && control.hasError('required')
          ? 'Вы не указали время начала работы' : control.hasError('pattern')
            ? 'Время начала работы должно быть в формате ЧЧ:ММ' : '';
      case 'to':
        return control.dirty && control.hasError('required') ?
          'Вы не указали время окончания работы' : control.hasError('pattern')
            ? 'Время начала работы должно быть в формате ЧЧ:ММ' : '';
      case 'config':
        return control.dirty && control.hasError('required') ? 'Вы не указали конфигурацию R-Keeper' : '';
      default:
        return control.dirty && control.hasError('required')
          ? 'Вы не указали адрес в соц. сети' : control.hasError('pattern')
            ? 'Вы указали адрес в соц. сети некорректно' : '';
    }
  }


  /**
   * Изменение состояние переключателя времени работы до последнего клиента
   * @param {boolean} value - Значение переключателя
   */
  onChangeUntilLastClient(value: boolean) {
    if (value) {
      this.restaurantForm.get('to').clearValidators();
      this.restaurantForm.get('to').reset('');
    } else {
      const timeRegExp = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
      this.restaurantForm.get('to').setValidators([Validators.required, Validators.pattern(timeRegExp)]);
      this.restaurantForm.get('to').reset('');
    }
    this.restaurantForm.markAsDirty();
  }

  /**
   * Добавление социальной сети в список на форме
   */
  appendSocialNetwork() {
    const network = {
      id: 0,
      restaurant_id: 0,
      network_type: this.restaurantsService.getSocialNetworkTypes()[0].code,
      url: '',
      timeCreated: new Date().getTime()
    };
    const siteRegExp = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]!\$&'\(\)\*\+,;=.]+$/;
    this.restaurantForm.addControl(
      `socialNetworkType${network.timeCreated}`,
      new FormControl(network.network_type, [Validators.required])
    );
    this.restaurantForm.addControl(
      `socialNetworkUrl${network.timeCreated}`,
      new FormControl('', [Validators.required, Validators.pattern(siteRegExp)])
    );
    this.socialNetworksData.push(network);
    this.restaurantForm.markAsDirty();
  }

  /**
   * Удаление социальной сети из списка формы
   * @param {ISocialNetworkDTO} network - Социальная сеть
   */
  removeSocialNetwork(network: ISocialNetworkDTO) {
    this.socialNetworksData.forEach((item: ISocialNetworkDTO, index: number, array: ISocialNetworkDTO[]) => {
      if ((item.id !== 0 && item.id === network.id) || (item.id === 0 && item.timeCreated && item.timeCreated === network.timeCreated)) {
        array.splice(index, 1);
        this.restaurantForm.removeControl(`socialNetworkType${network.id !== 0 ? network.id : network.timeCreated}`);
        this.restaurantForm.removeControl(`socialNetworkUrl${network.id !== 0 ? network.id : network.timeCreated}`);
        this.restaurantForm.markAsDirty();
      }
      if (this.socialNetworksData.length === 0) {
        this.restaurantForm.updateValueAndValidity();
      }
    });
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
