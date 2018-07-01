import { IRoleDTO } from './role.dto';


/**
 * User Data transfer object interface
 */
export interface IUserDTO {
  id: number;             // Идентификатор
  company_id: number;     // Идентификатор компании
  first_name: string;     // Имя
  patronymic: string;     // Отчество
  last_name: string;      // Фамилия
  email: string;          // E-mail
  phone: string;          // Телефон
  password?: string;      // Пароль
  is_active?: boolean;    // Включен ли пользователь
  is_owner?: boolean;     // Является ли владельцем
  roles_ids?: number[];   // Массив идентификаторо ролей
  roles?: {               // Набор ролей пользователя
    data: IRoleDTO[];
  };
}
