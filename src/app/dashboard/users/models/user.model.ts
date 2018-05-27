import { IUser } from '../interfaces/user.interface';
import { IRole } from '../interfaces/role.interface';

/**
 * Класс, реализующий интерфейс пользователя
 */
export class User implements IUser {
  id: number;                 // Идентификатор
  firstName: string;          // Имя
  secondName: string;         // Отчество
  lastName: string;           // Фамилия
  email: string;              // E-mail
  password: string;           // Пароль
  phone: string | null;       // Телефон
  roles: IRole[];             // Набор ролей
  fio; string;                // ФИО

  /**
   * Конструктор
   * @param {IUser} config - Параметры инициализации
   */
  constructor(config?: IUser) {
    this.id = config ? config.id : 0;
    this.firstName = config ? config.firstName : '';
    this.secondName = config ? config.secondName : '';
    this.lastName = config ? config.lastName : '';
    this.email = config ? config.email : '';
    this.password = config ? config.password : '';
    this.phone = config && config.phone ? config.phone : null;
    this.fio = `${this.firstName} ${this.secondName} ${this.lastName}`;
  }
}
