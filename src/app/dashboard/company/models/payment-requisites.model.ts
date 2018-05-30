import { IPaymentRequisites } from '../interfaces/payment-requisites.interface';

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
  constructor(config?: IPaymentRequisites) {
    this.id = config ? config.id : 0;
    this.businessTitle = config ? config.businessTitle : '';
    this.INN = config ? config.INN : '';
    this.KPP = config ? config.KPP : '';
    this.businessAddress = config ? config.businessAddress : '';
    this.address = config ? config.address : '';
    this.bankTitle = config ? config.bankTitle : '';
    this.account = config ? config.account : '';
    this.correspondingAccount = config ? config.correspondingAccount : '';
    this.BIK = config ? config.BIK : '';
  }
}
