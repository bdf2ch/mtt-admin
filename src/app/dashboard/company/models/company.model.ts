import { ICompany } from '../interfaces/company.interface';
import { IRestaurant } from '../../restaurants/interfaces/restaurant.interface';
import { IPaymentRequisites } from '../interfaces/payment-requisites.interface';
import { PaymentRequisites } from './payment-requisites.model';
import { ICompanyDTO } from '../dto/company.dto';
import { IPaymentRequisitesDTO } from '../dto/payment-requisites.dto';
import { RKeeperConfig } from './r-keeper-config.model';

/**
 * Класс, реализующий интерфейс компании
 */
export class Company implements ICompany {
  id: number;                                   // Идентификатор
  title: string;                                // Наименование
  www: string;                                  // Сайт
  phone: string;                                // Телефон
  rKeeperConfig: RKeeperConfig | null;          // Конфигурация R-Keeper
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
    this.rKeeperConfig = config && config.rKeeperConfig ? new RKeeperConfig(config.rKeeperConfig.data) : null;
    this.restaurants = [];
    this.paymentRequisites = [];

    if (config && config.paymentRequisites) {
      config.paymentRequisites.data.forEach((item: IPaymentRequisitesDTO) => {
        const paymentRequisites = new PaymentRequisites(item);
        this.paymentRequisites.push(paymentRequisites);
      });
    }
  }
}
