import { IRestaurant } from '../../restaurants/interfaces/restaurant.interface';
import { IPaymentRequisites } from './payment-requisites.interface';

/**
 * Интерфейс, описывающий компанию
 */
export interface ICompany {
  id: number;                                 // Идентификатор
  title: string;                              // Наименование
  www: string;                                // Сайт
  phone: string;                              // Телефон
  rKeeperConfig: any;                         // Конфигурация R-Keeper
  restaurants: IRestaurant[];                 // Набор ресторынов
  paymentRequisites: IPaymentRequisites[];    // Набор платежных реквизитов
}
