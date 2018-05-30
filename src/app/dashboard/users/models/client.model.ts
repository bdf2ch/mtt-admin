import { IClient } from '../interfaces/client.interface';
import { ICompany } from '../../company/interfaces/company.interface';
import { IRole } from '../interfaces/role.interface';
import { User } from './user.model';
import { Company } from '../../company/models/company.model';
import { IClientDTO } from '../dto/client.dto';

/**
 * Класс, реализующий интерфейс клиента
 */
export class Client extends User implements IClient {
  id: number;             // Идентификатор
  firstName: string;      // Имя
  secondName: string;     // Отчество
  lastName: string;       // Фамилия
  phone: string;          // Телефон
  email: string;          // E-mail
  password: string;       // Пароль
  roles: IRole[];         // Роли пользователя
  company: ICompany;      // Компания

  /**
   * Конструктор
   * @param {IClient} config - Параметры инициализации
   */
  constructor(config?: IClientDTO) {
    super(config ? config : null);
    this.company = config ? new Company(config.company) : new Company();
  }
}
