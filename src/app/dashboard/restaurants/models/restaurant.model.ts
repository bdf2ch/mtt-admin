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
    this.address = config ? new Address(config.address['data']) : new Address();
    this.timeTable = config ? new TimeTable(config.work_intervals[0]) : new TimeTable();
    this.social = [];

    if (config) {
      config.social_networks.forEach((item: ISocialNetworkDTO) => {
        const social = new SocialNetwork(item);
        this.social.push(social);
      });
    }
    console.log(this);
  }
}
