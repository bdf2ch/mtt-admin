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
  rKeeperConfig?: {                               // Конфигурация R-Keeper
    data?: {
      id: number;
    },
    id?: number;                  // Идентификатор
    reward_code_from?: number;     // Начало диапазона генерируемых кодов
    reward_code_to?: number;       // Конец диапазона генерируемых кодов
    discount_types?: {             // Коды соответствия типо вознаграждений
      product: number;
      money: number;
      discount: number;
      loyalty: number;
    };
  };
  address?: IAddressDTO;                          // Адрес
  workIntervals?: {                               // Расписание работы
    data: ITimeTableDTO
  };
  socialNetworks?: {                              // Список социальных сетей
    data: ISocialNetworkDTO[];
  };
  statistic?: {
    data: {
      value: number,
      type: string
    };
  };
}
