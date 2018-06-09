import { IPermission } from '../interfaces/permission.interface';
import { IPermissionDTO } from '../dto/permission.dto';

export class Permission implements IPermission {
  id: number;               // Идентификатор
  code: string;             // Код права пользователя
  title: string;            // Наименование права пользователя
  description: string;      // Описание права пользователя
  isEnabled: boolean;       // Включено ли право

  /**
   * Конструктор
   * @param {IPermissionDTO} config - Параметры инициализации
   */
  constructor(config?: IPermissionDTO) {
    this.id = config ? config.id : 0;
    this.code = config ? config.name : '';
    this.title = config ? config.display_name : '';
    this.description = config ? config.description : '';
    this.isEnabled = false;
  }
}
