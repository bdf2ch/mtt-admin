import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { UsersResource } from '../resources/users.resource';
import { IUserDTO } from '../dto/user.dto';
import { IServerResponse } from '../../../shared/interfaces/server-response.interface';
import { Role } from '../models/role.model';
import { IRoleDTO } from '../dto/role.dto';
import { Permission } from '../models/permission.model';
import {IPermissionDTO} from "../dto/permission.dto";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private roles: Role[];
  private permissions: Permission[];
  private users: User[];
  private isAddingUserRoleInProgress: boolean;
  private isEditingUserRoleInProgress: boolean;
  private isDeletingUserRoleInProgress: boolean;

  constructor(private readonly resource: UsersResource) {
    this.roles = [];
    this.permissions = [];
    this.users = [];
    this.isAddingUserRoleInProgress = false;
    this.isEditingUserRoleInProgress = false;
    this.isDeletingUserRoleInProgress = false;
  }

  /**
   * Возвращает список всех ролей пользователей
   * @returns {Role[]}
   */
  getRoleList(): Role[] {
    return this.roles;
  }

  /**
   * Возвращает список всех прав пользователя
   * @returns {Permission[]}
   */
  getPermissionList(): Permission[] {
    return this.permissions;
  }

  /**
   * Возвращает список всех пользователей
   * @returns {User[]}
   */
  getUserList(): User[] {
    return this.users;
  }

  /**
   * Выполняется ли добавление роли пользователя
   * @returns {boolean}
   */
  addingRoleInProgress(): boolean {
    return this.isAddingUserRoleInProgress;
  }

  /**
   * Выполняется ли изменение роли пользователя
   * @returns {boolean}
   */
  editingRoleInProgress(): boolean {
    return this.isEditingUserRoleInProgress;
  }

  /**
   * Выполняется ли удаление роли пользователя
   * @returns {boolean}
   */
  deletingRoleInProgress(): boolean {
    return this.isDeletingUserRoleInProgress;
  }

  /**
   * Получение списка пользователей по идентификатору компании
   * @param {number} companyId - Идентификатор компании
   * @returns {Promise<User[]>}
   */
  async fetchUsersByCompanyId(companyId: number): Promise<User[]> {
    try {
      const result: IServerResponse<IUserDTO[]> = await this.resource.getUsersByCompanyId({companyId: companyId});
      if (result.data) {
        this.users = [];
        result.data.forEach((item: IUserDTO) => {
          const user = new User(item);
          this.users.push(user);
        });
      }
      return this.users;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Получение списка ролей пользователей по идентификатору компании
   * @param {number} companyId - Идентификатор компании
   * @returns {Promise<Role[]>}
   */
  async fetchUserRolesByCompanyId(companyId: number): Promise<Role[]> {
    try {
      const result = await this.resource.getUserRolesByCompanyId({companyId: companyId});
      if (result.data) {
        this.roles = [];
        result.data.forEach((item: IRoleDTO) => {
          const role = new Role(item);
          this.roles.push(role);
        });
        return this.roles;
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Получение списка прав пользователя
   * @returns {Promise<Permission[]>}
   */
  async fetchPermissions(): Promise<Permission[]> {
    try {
      const result = await this.resource.getPermissions();
      if (result.data) {
        result.data.forEach((item: IPermissionDTO) => {
          const permission = new Permission(item);
          this.permissions.push(permission);
        });
        console.log(this.permissions);
        return this.permissions;
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Добавление роли пользователя
   * @param {IRoleDTO} role - Роль пользователя
   * @param {number} companyId - Идентификатор компании
   * @returns {Promise<Role | null>}
   */
  async addUserRole(role: IRoleDTO, companyId: number): Promise<Role | null> {
    try {
      const result = await this.resource.addUserRole(role, null, {companyId: companyId});
      if (result.data) {
        const role_ = new Role(result.data);
        this.roles.push(role_);
        return role_;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
