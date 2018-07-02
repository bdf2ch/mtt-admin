import { IAddress } from './address.interface';
import { ITimeTable } from './time-table.interface';
import { ISocialNetwork } from './social-network.interface';
import { RKeeperConfig } from '../../company/models/r-keeper-config.model';

/**
 * Интерфейс, описывающиц ресторан
 */
export interface IRestaurant {
  id: number;                     // Идентификатор
  title: string;                  // Наименование
  phone: string;                  // Телефон
  www: string;                    // Сайт
  rKeeperConfig?: RKeeperConfig;  // Идентификатор R-Keeper
  address: IAddress;              // Адрес
  timeTable: ITimeTable;          // Расписание работы
  social: ISocialNetwork[];       // Набор социальных сетей
  isSelected: boolean;            // Выбран ли ресторан (при создании опроса)
}
