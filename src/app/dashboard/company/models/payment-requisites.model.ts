import { IPaymentRequisites } from '../interfaces/payment-requisites.interface';
import { IPaymentRequisitesDTO } from '../dto/payment-requisites.dto';

/**
 * Класс, реализующий интерфейс платежных реквизитов
 */
export class PaymentRequisites implements IPaymentRequisites {
  id: number;                       // Идентификатор
  companyId: number;                // Идентификатор компании
  businessTitle: string;            // Наименование юр. лица
  INN: string;                      // ИНН
  KPP: string;                      // КПП
  businessAddress: string;          // Юридический адрес
  address: string;                  // Физический адрес
  bankTitle: string;                // Наименование банка
  account: string;                  // Расчетный счет
  correspondingAccount: string;     // Корреспондентский счет
  BIK: string;                      // БИК
  isPrimary: boolean;               // Являются ли основными

  /**
   * Конструктор
   * @param {IPaymentRequisites} config - Параметры инициализации
   */
  constructor(config?: IPaymentRequisitesDTO) {
    this.id = config ? config.id : 0;
    this.companyId = config ? config.company_id : 0;
    this.businessTitle = config ? config.name : null;
    this.INN = config ? config.inn : null;
    this.KPP = config ? config.kpp : null;
    this.businessAddress = config ? config.legal_address : null;
    this.address = config ? config.actual_address : null;
    this.bankTitle = config ? config.bank_name : null;
    this.account = config ? config.checking_account : null;
    this.correspondingAccount = config ? config.correspondent_account : null;
    this.BIK = config ? config.bik : null;
    this.isPrimary = config ? Boolean(config.primary) : false;
  }

  /**
   * Экспорт модели в DTO
   * @returns {IPaymentRequisitesDTO}
   */
  toDTO(): IPaymentRequisitesDTO {
    const dto: IPaymentRequisitesDTO = {
      id: this.id,
      company_id: this.companyId,
      name: this.businessTitle,
      inn: this.INN,
      kpp: this.KPP,
      bank_name: this.bankTitle,
      legal_address: this.businessAddress,
      actual_address: this.address,
      checking_account: this.account,
      correspondent_account: this.correspondingAccount,
      bik: this.BIK,
      primary: Number(this.isPrimary)
    };
    return dto;
  }
}
