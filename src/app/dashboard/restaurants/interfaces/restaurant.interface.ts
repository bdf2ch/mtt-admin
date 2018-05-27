import { IAddress } from './address.interface';
import { ITimeTable } from './time-table.interface';
import { ISocialNetwork } from './social-network.interface';

/**
 * Интерфейс, описывающиц ресторан
 */
export interface IRestaurant {
  id: number;                 // Идентификатор
  companyId: number;          // Идентификатор компании
  title: string;              // Наименование
  phone: string;              // Телефон
  www: string;                // Сайт
  rKeeperConfig: any;         // Конфигурация R-Keeper
  address: IAddress;          // Адрес
  timeTable: ITimeTable;      // Расписание работы
  social: ISocialNetwork[];   // Набор социальных сетей
}
