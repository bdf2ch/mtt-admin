import { IRestaurant } from '../interfaces/restaurant.interface';
import { IAddress } from '../interfaces/address.interface';
import { ITimeTable } from '../interfaces/time-table.interface';
import { ISocialNetwork } from '../interfaces/social-network.interface';
import { Address } from './address.model';
import { TimeTable } from './time-table.model';
import { SocialNetwork } from './social-network.model';

/**
 * Класс, реализующий интерфейс ресторана
 */
export class Restaurant implements IRestaurant {
  id: number;                 // Идентфиикатор
  companyId: number;          // Идентификатор компании
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
  constructor(config?: IRestaurant) {
    this.id = config ? config.id : 0;
    this.companyId = config ? config.companyId : 0;
    this.title = config ? config.title : '';
    this.phone = config ? config.phone : '';
    this.www = config ? config.www : '';
    this.rKeeperConfig = config ? config.rKeeperConfig : {};
    this.address = config ? new Address(config.address) : new Address();
    this.timeTable = config ? new TimeTable(config.timeTable) : new TimeTable();
    this.social = [];

    if (config) {
      config.social.forEach((item: ISocialNetwork) => {
        const social = new SocialNetwork(item);
        this.social.push(social);
      });
    }
  }
}
