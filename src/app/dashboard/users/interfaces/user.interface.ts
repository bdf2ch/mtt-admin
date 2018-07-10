import { IRole } from './role.interface';
import { PermissionManager } from '../models/permission-manager.model';

/**
 * Интерфейс, описывающий пользователя
 */
export interface IUser {
  id: number;                         // Идентификатор
  companyId: number;                  // Идентификатор компании
  firstName: string;                  // Имя
  secondName: string;                 // Отество
  lastName: string;                   // Фамилия
  email: string;                      // E-mail
  password?: string;                  // Пароль
  phone?: string;                     // Телефон
  isActive: boolean;                  // Включен ли пользователь
  isOwner: boolean;                   // Является ли владельцем
  roles: IRole[];                     // Набор ролей
  permissions: PermissionManager;     // Роли и права пользователя
}
