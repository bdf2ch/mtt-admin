import { IPaymentRequisitesDTO } from './payment-requisites.dto';
import { IRKeeperConfigDTO } from './r-keeper-config.dto';
import {IUserDTO} from '../../users/dto/user.dto';

/**
 * Company DTO interface
 */
export interface ICompanyDTO {
  id: number;                     // Идентификатор
  name: string;                   // Наименование
  site: string | null;            // Сайт
  phone: string | null;           // Телефон
  paymentRequisites?: {           // Платежные реквизиты
    data: IPaymentRequisitesDTO[];
  };
  rKeeperConfig?: {               // Конфигурация R-Keeper
    data?: IRKeeperConfigDTO;
    id?: number;                   // Идентификатор
    reward_code_from?: number;     // Начало диапазона генерируемых кодов
    reward_code_to?: number;       // Конец диапазона генерируемых кодов
    discount?: {             // Коды соответствия типо вознаграждений
      product: number;
      money: number;
      discount: number;
      loyalty: number;
    };
  };

  reward_code_from?: number;     // Начало диапазона генерируемых кодов
  reward_code_to?: number;       // Конец диапазона генерируемых кодов
  discount_types?: {             // Коды соответствия типо вознаграждений
    product: number;
    money: number;
    discount: number;
    loyalty: number;
  };
  personal?: {                  // Массив пользователей компании
    data: IUserDTO[];
  };
}
