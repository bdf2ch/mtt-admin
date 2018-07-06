import {IClientDTO} from '../dto/client.dto';

export class Client {
  id: string;               // Идентификатор
  companyId: number;        // Идентификатор компании
  firstName: string;        // Имя
  lastName: string;         // Фамилия
  email: string;            // E-mail
  phone: string;            // Телефон

  /**
   * Конструктор
   * @param {IClientDTO} config - Параметры инициализации
   */
  constructor(config?: IClientDTO) {
    this.id = config ? config.id : '';
    this.companyId = config ? config.company_id : 0;
    this.firstName = config ? config.first_name : '';
    this.lastName = config ? config.last_name : '';
    this.email = config ? config.email : null;
    this.phone = config ? config.phone : null;
  }
}
