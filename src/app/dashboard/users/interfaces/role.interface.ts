import { IPermission } from './permission.interface';


/**
 * Интерфейс, описывающий роль пользователя
 */
export interface IRole {
  id: number;                   // Идентфиикатор роли
  companyId?: number;           // Идентфикатор компании
  title: string;                // Наименование
  description: string;          // Описание роли
  code: string;                 // Код роли
  permissions: IPermission[];   // Список прав роли
}
