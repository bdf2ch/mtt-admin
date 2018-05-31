import { IPaymentRequisites } from '../interfaces/payment-requisites.interface';
import {IPaymentRequisitesDTO} from '../dto/payment-requisites.dto';

/**
 * Класс, реализующий интерфейс платежных реквизитов
 */
export class PaymentRequisites implements IPaymentRequisites {
  id: number;                       // Идентификатор
  businessTitle: string;            // Наименование юр. лица
  INN: string;                      // ИНН
  KPP: string;                      // КПП
  businessAddress: string;          // Юридический адрес
  address: string;                  // Физический адрес
  bankTitle: string;                // Наименование банка
  account: string;                  // Расчетный счет
  correspondingAccount: string;     // Корреспондентский счет
  BIK: string;                      // БИК

  /**
   * Конструктор
   * @param {IPaymentRequisites} config - Параметры инициализации
   */
  constructor(config?: IPaymentRequisitesDTO) {
    this.id = config ? config.id : 0;
    this.businessTitle = config ? config.name : '';
    this.INN = config ? config.inn : '';
    this.KPP = config ? config.kpp : '';
    this.businessAddress = config ? config.legal_address : '';
    this.address = config ? config.actual_address : '';
    this.bankTitle = config ? config.bank_name : '';
    this.account = config ? config.checking_account : '';
    this.correspondingAccount = config ? config.correspondent_account : '';
    this.BIK = config ? config.bik : '';
  }
}
