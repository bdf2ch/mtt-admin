import { IPermissionDTO } from './permission.dto';


/**
 * Role DTO interface
 */
export interface IRoleDTO {
  id: number;                 // Идентификатор
  name: string;               // Код роли
  display_name: string;       // Наименование роли
  description: string;        // Описание роли
  permissions?: {             // Список прав роли
    data: IPermissionDTO[]
  };
}
