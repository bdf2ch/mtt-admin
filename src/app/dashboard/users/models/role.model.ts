import { IRole } from '../interfaces/role.interface';
import { IRoleDTO } from '../dto/role.dto';
import { Permission } from './permission.model';
import { IPermissionDTO } from '../dto/permission.dto';

/**
 * Класс, реадизцющий интерфейс роли пользователя
 */
export class Role implements IRole {
  id: number;                   // Идентификатор
  title: string;                // Наименование
  description: string;          // Описание роли
  code: string;                 // Код роли
  isEnabled: boolean;           // Выбрана ли роль (при добавлении сотрудника)
  permissions: Permission[];    // Список прав роли

  /**
   * Конструктор
   * @param {IRole} config - Параметры инициализации
   */
  constructor(config?: IRoleDTO) {
    this.id = config ? config.id : 0;
    this.title = config ? config.display_name : '';
    this.description = config ? config.description : '';
    this.code = config ? config.name : '';
    this.isEnabled = false;
    this.permissions = [];

    if (config && config.permissions) {
      config.permissions.data.forEach((item: IPermissionDTO) => {
        const permission = new Permission(item);
        this.permissions.push(permission);
      });
    }
  }
}
