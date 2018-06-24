import { IRestaurant } from '../interfaces/restaurant.interface';
import { IAddress } from '../interfaces/address.interface';
import { ITimeTable } from '../interfaces/time-table.interface';
import { ISocialNetwork } from '../interfaces/social-network.interface';
import { Address } from './address.model';
import { TimeTable } from './time-table.model';
import { SocialNetwork } from './social-network.model';
import { IRestaurantDTO } from '../dto/restaurant.dto';
import {ISocialNetworkDTO} from '../dto/social-network.dto';

/**
 * Класс, реализующий интерфейс ресторана
 */
export class Restaurant implements IRestaurant {
  id: number;                 // Идентфиикатор
  title: string;              // Наименование
  phone: string;              // Телефон
  www: string;                // Сайт
  rKeeperConfig: any;         // Конфигурация R-Keeper
  address: IAddress;          // Адрес
  timeTable: ITimeTable;      // Расписание работы
  social: ISocialNetwork[];   // Набор социальных сетей
  isSelected: boolean;        // Выбран ли ресторан ()при создании опроса

  /**
   * Конструктор
   * @param {IRestaurant} config - Параметры инициализации
   */
  constructor(config?: IRestaurantDTO) {
    this.id = config ? config.id : 0;
    this.title = config ? config.name : '';
    this.phone = config ? config.phone : '';
    this.www = config ? config.site : '';
    this.rKeeperConfig = config ? config.r_keeper_config : {};
    this.address = config && config.address ? new Address(config.address['data']) : new Address();
    this.timeTable = config && config.workIntervals ? new TimeTable(config.workIntervals.data) : new TimeTable();
    this.social = [];
    this.isSelected = false;

    if (config && config.socialNetworks) {
      config.socialNetworks.data.forEach((item: ISocialNetworkDTO) => {
        const social = new SocialNetwork(item);
        this.social.push(social);
      });
    }
    console.log(this);
  }
}
