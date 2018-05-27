import { IRole } from './role.interface';

/**
 * Интерфейс, описывающий пользователя
 */
export interface IUser {
  id: number;             // Идентификатор
  firstName: string;      // Имя
  secondName: string;     // Отество
  lastName: string;       // Фамилия
  email: string;          // E-mail
  password: string;       // Пароль
  phone?: string;         // Телефон
  roles: IRole[];         // Набор ролей
}
