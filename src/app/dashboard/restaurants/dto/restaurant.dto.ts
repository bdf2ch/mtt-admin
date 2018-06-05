import { ITimeTableDTO } from './time-table.dto';
import {IAddressDTO} from './address.dto';

/**
 * Restaurant DTO interface
 */
export interface IRestaurantDTO {
  id: number;                             // Идентификатор
  name: string;                           // Наименование
  phone: string | null;                   // Телефон
  site: string | null;                    // Сайт
  r_keeper_config?: any;                  // Конфигурация R-Keeper
  address?: IAddressDTO;
  work_interval?: ITimeTableDTO | null;   // Расписание работы
}
