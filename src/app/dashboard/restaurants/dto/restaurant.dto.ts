import { ITimeTableDTO } from './time-table.dto';
import {IAddressDTO} from './address.dto';
import {ISocialNetworkDTO} from './social-network.dto';

/**
 * Restaurant DTO interface
 */
export interface IRestaurantDTO {
  id: number;                                     // Идентификатор
  name: string;                                   // Наименование
  phone: string | null;                           // Телефон
  site: string | null;                            // Сайт
  r_keeper_config?: any;                          // Конфигурация R-Keeper
  address?: IAddressDTO;                          // Адрес
  work_intervals?: ITimeTableDTO[] | null;        // Расписание работы
  social_networks?: ISocialNetworkDTO[] | null;   // Список социальных сетей
}
