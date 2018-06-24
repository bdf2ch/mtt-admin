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
  workIntervals?: {                               // Расписание работы
    data: ITimeTableDTO
  };
  socialNetworks?: {                              // Список социальных сетей
    data: ISocialNetworkDTO[];
  };
}
