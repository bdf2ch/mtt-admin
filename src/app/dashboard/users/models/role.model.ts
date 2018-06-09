import { IRole } from '../interfaces/role.interface';
import { IRoleDTO } from '../dto/role.dto';

/**
 * Класс, реадизцющий интерфейс роли пользователя
 */
export class Role implements IRole {
  id: number;             // Идентификатор
  title: string;          // Наименование
  description: string;    // Описание роли
  code: string;           // Код роли

  /**
   * Конструктор
   * @param {IRole} config - Параметры инициализации
   */
  constructor(config?: IRoleDTO) {
    this.id = config ? config.id : 0;
    this.title = config ? config.display_name : '';
    this.description = config ? config.description : '';
    this.code = config ? config.name : '';
  }
}
