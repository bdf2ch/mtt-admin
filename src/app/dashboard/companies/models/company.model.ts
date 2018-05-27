import { ICompany } from '../interfaces/company.interface';
import { IRestaurant } from '../../restaurants/interfaces/restaurant.interface';
import { IPaymentRequisites } from '../interfaces/payment-requisites.interface';
import { Restaurant } from '../../restaurants/models/restaurant.model';
import { PaymentRequisites } from './payment-requisites.model';

/**
 * Класс, реализующий интерфейс компании
 */
export class Company implements ICompany {
  id: number;                                   // Идентификатор
  title: string;                                // Наименование
  www: string;                                  // Сайт
  phone: string;                                // Телефон
  rKeeperConfig: any;                           // Конфигурация R-Keeper
  restaurants: IRestaurant[];                   // Набор ресторанов
  paymentRequisites: IPaymentRequisites[];      // Набор платежных реквизитов

  /**
   * Конструктор
   * @param {ICompany} config - Парамеьтры инициализации
   */
  constructor(config?: ICompany) {
    this.id = config ? config.id : 0;
    this.title = config ? config.title : '';
    this.www = config ? config.www : '';
    this.phone = config ? config.phone : '';
    this.rKeeperConfig = config ? config.rKeeperConfig : {};
    this.restaurants = [];
    this.paymentRequisites = [];

    if (config) {
      config.restaurants.forEach((item: IRestaurant) => {
        const restaurant = new Restaurant(item);
        this.restaurants.push(restaurant);
      });
      config.paymentRequisites.forEach((item: IPaymentRequisites) => {
        const paymentRequisites = new PaymentRequisites(item);
        this.paymentRequisites.push(paymentRequisites);
      });
    }
  }
}
