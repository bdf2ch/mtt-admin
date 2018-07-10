import { IUser } from '../interfaces/user.interface';
import { IRole } from '../interfaces/role.interface';
import { IUserDTO } from '../dto/user.dto';
import { IRoleDTO } from '../dto/role.dto';
import { Role } from './role.model';
import { Company } from '../../company/models/company.model';
import {PermissionManager} from './permission-manager.model';

/**
 * Класс, реализующий интерфейс пользователя
 */
export class User implements IUser {
  id: number;                       // Идентификатор
  companyId: number;                // Идентификатор компании
  firstName: string;                // Имя
  secondName: string;               // Отчество
  lastName: string;                 // Фамилия
  email: string;                    // E-mail
  // password: string;              // Пароль
  phone: string | null;             // Телефон
  isActive: boolean;                // Включен ли пользователь
  isOwner: boolean;                 // Является ли владельцем
  roles: Role[];                   // Набор ролей
  fio: string;                      // ФИО
  rolesLabel: string;               // Роли одной строкой
  company?: Company;                // Компания пользователя
  permissions: PermissionManager;   // Роли и права пользователя

  /**
   * Конструктор
   * @param {IUser} config - Параметры инициализации
   */
  constructor(config?: IUserDTO) {
    this.id = config ? config.id : 0;
    this.companyId = config ? config.company_id : 0;
    this.firstName = config ? config.first_name : '';
    this.secondName = config ? config.patronymic : '';
    this.lastName = config ? config.last_name : '';
    this.email = config ? config.email : '';
    //this.password = config ? config.password : '';
    this.phone = config && config.phone ? config.phone : null;
    this.isActive = config ? config.is_active : true;
    this.isOwner = config ? config.is_owner : false;
    this.fio = `${this.firstName} ${this.secondName} ${this.lastName}`;
    this.roles = [];
    this.rolesLabel = '';
    // this.permissions = new PermissionManager();

    if (config && config.roles) {
      config.roles.data.forEach((item: IRoleDTO) => {
        const role = new Role(item);
        this.roles.push(role);
      });
      this.permissions = new PermissionManager(this.roles);
      this.generateRolesLabel();
    }
  }

  /**
   * Возвращает список ролей пользователя однйо строкой
   */
  generateRolesLabel() {
    this.rolesLabel = 'Роли: ';
    this.roles.forEach((role: Role, index: number, array: Role[]) => {
      this.rolesLabel += `${role.title} ${index < array.length - 1 ? ', ' : ''}`;
    });
  }

  /**
   * Поиск роли пользователя по коду
   * @param {string} code
   * @returns {IRole | null}
   */
  getRoleByCode(code: string): IRole | null {
    const findRoleById = (item: Role) => item.code === code;
    const role = this.roles.find(findRoleById);
    return role ? role : null;
  }
}
