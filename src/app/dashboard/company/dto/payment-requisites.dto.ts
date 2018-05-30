/**
 * Payment requisites DTO interface
 */
export interface IPaymentRequisitesDTO {
  company_id: number;               // Идентфиикатор компании
  name: string;                     // Наименование
  inn: string;                      // ИНН
  kpp: string;                      // КПП
  legal_address: string;            // Юридический адрес
  bank_name: string;                // Наименование банка
  checking_account: string;         // Расчетный счет
  correspondent_account: string;    // Корреспондентский счет
  bik: string;                      // БИК
  primary: number;                       // ???
}
