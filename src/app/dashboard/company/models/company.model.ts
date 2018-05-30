import { ICompany } from '../interfaces/company.interface';
import { IRestaurant } from '../../restaurants/interfaces/restaurant.interface';
import { IPaymentRequisites } from '../interfaces/payment-requisites.interface';
import { Restaurant } from '../../restaurants/models/restaurant.model';
import { PaymentRequisites } from './payment-requisites.model';
import { ICompanyDTO } from '../dto/company.dto';

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
   * @param {ICompanyDTO} config - Парамеьтры инициализации
   */
  constructor(config?: ICompanyDTO) {
    this.id = config ? config.id : 0;
    this.title = config ? config.name : '';
    this.www = config ? config.site : '';
    this.phone = config ? config.phone : '';
    this.rKeeperConfig = config ? config.r_keeper_config : {};
    this.restaurants = [];
    this.paymentRequisites = [];

    if (config && config.paymentRequisites) {
      config.paymentRequisites.data.forEach((item: IPaymentRequisites) => {
        const paymentRequisites = new PaymentRequisites(item);
        this.paymentRequisites.push(paymentRequisites);
      });
    }
    /*
    if (config && config.restaurants) {
      config.restaurants['data'].forEach((item: IRestaurant) => {
        const restaurant = new Restaurant(item);
        this.restaurants.push(restaurant);
      });
    }
    */
  }
}