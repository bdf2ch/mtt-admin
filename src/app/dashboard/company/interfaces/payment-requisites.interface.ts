/**
 * Интерфейс, описывающий платежные реквизиты
 */
export interface IPaymentRequisites {
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
}
