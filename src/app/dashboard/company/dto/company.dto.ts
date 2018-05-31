import { IPaymentRequisitesDTO } from './payment-requisites.dto';

/**
 * Company DTO interface
 */
export interface ICompanyDTO {
  id: number;                     // Идентификатор
  name: string;                   // Наименование
  site: string | null;            // Сайт
  phone: string | null;           // Телефон
  r_keeper_config?: any | null;   // Конфигурация R-Keeper
  paymentRequisites?: {           // Платежные реквизиты
    data: IPaymentRequisitesDTO[];
  };
}
