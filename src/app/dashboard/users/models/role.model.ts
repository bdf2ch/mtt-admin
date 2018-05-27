import { IRole } from '../interfaces/role.interface';

/**
 * Класс, реадизцющий интерфейс роли пользователя
 */
export class Role implements IRole {
  id: number;           // Идентификатор
  companyId: number;    // Идентификатор компании
  title: string;        // Наименование

  /**
   * Конструктор
   * @param {IRole} config - Параметры инициализации
   */
  constructor(config?: IRole) {
    this.id = config ? config.id : 0;
    this. companyId = config ? config.companyId : null;
    this.title = config ? config.title : '';
  }
}
