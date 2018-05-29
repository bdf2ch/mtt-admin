import { IUser } from '../interfaces/user.interface';
import { IRole } from '../interfaces/role.interface';
import {IUserDTO} from '../dto/user.dto';

/**
 * Класс, реализующий интерфейс пользователя
 */
export class User implements IUser {
  id: number;                 // Идентификатор
  companyId: number;          // Идентификатор компании
  firstName: string;          // Имя
  secondName: string;         // Отчество
  lastName: string;           // Фамилия
  email: string;              // E-mail
  password: string;           // Пароль
  phone: string | null;       // Телефон
  roles: IRole[];             // Набор ролей
  fio: string;                // ФИО

  /**
   * Конструктор
   * @param {IUser} config - Параметры инициализации
   */
  constructor(config?: IUserDTO) {
    this.id = config ? config.id : 0;
    this.companyId = config ? config.company_id : 0;
    this.firstName = config ? config.first_name : '';
    this.secondName = config ? config.patronymic : '';
    this.lastName = config ? config.last_name : '';
    this.email = config ? config.email : '';
    //this.password = config ? config.password : '';
    this.phone = config && config.phone ? config.phone : null;
    this.fio = `${this.firstName} ${this.secondName} ${this.lastName}`;
  }
}
