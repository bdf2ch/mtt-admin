import { IPaymentRequisitesDTO } from './payment-requisites.dto';
import { IRKeeperConfigDTO } from './r-keeper-config.dto';

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
  };

  reward_code_from?: number;     // Начало диапазона генерируемых кодов
  reward_code_to?: number;       // Конец диапазона генерируемых кодов
  discount_types?: {             // Коды соответствия типо вознаграждений
    product: number;
    money: number;
    discount: number;
    loyalty: number;
  };
}
