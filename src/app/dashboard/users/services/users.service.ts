import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { UsersResource } from '../resources/users.resource';
import { IUserDTO } from '../dto/user.dto';
import { IServerResponse } from '../../../shared/interfaces/server-response.interface';
import { Role } from '../models/role.model';
import { IRoleDTO } from '../dto/role.dto';
import { Permission } from '../models/permission.model';
import { IPermissionDTO } from '../dto/permission.dto';

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
  private isAddingUserInProgress: boolean;
  private isEditingUserInProgress: boolean;
  private isDeletingUserInProgress: boolean;
  private isSettingUserStatusInProgress: boolean;

  constructor(private readonly resource: UsersResource) {
    this.roles = [];
    this.permissions = [];
    this.users = [];
    this.isAddingUserRoleInProgress = false;
    this.isEditingUserRoleInProgress = false;
    this.isDeletingUserRoleInProgress = false;
    this.isAddingUserInProgress = false;
    this.isEditingUserInProgress = false;
    this.isDeletingUserInProgress = false;
    this.isSettingUserStatusInProgress = false;
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
   * Выполняетс ли добавление польтзователя
   * @returns {boolean}
   */
  addingUserInProgress(): boolean {
    return this.isAddingUserInProgress;
  }

  /**
   * Выполняется ли изменение пользователя
   * @returns {boolean}
   */
  editingUserInProgress(): boolean {
    return this.isEditingUserInProgress;
  }

  /**
   * Выполняется ли удаление поьзователя
   * @returns {boolean}
   */
  deletingUserInProgress(): boolean {
    return this.isDeletingUserInProgress;
  }

  /**
   * выполняется ли изменение статуса пользователя
   * @returns {boolean}
   */
  settingUserStatusInProgress(): boolean {
    return this.isSettingUserStatusInProgress;
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
        this.permissions = [];
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

  /**
   * Изменение информации о роли пользователя
   * @param {IRoleDTO} role - Роль пользователя
   * @param {number} companyId - Идентификатор компании
   * @returns {Promise<Role | null>}
   */
  async editUserRole(role: IRoleDTO, companyId: number): Promise<Role | null> {
    const findRoleById = (item: Role) => item.id === role.id;
    const role_ = this.roles.find(findRoleById);
    if (role_) {
      const addedPermissionsIds = [];
      this.permissions.forEach((permission: Permission) => {
        if (permission.isEnabled) {
          const findPermissionById = (perm: Permission) => perm.id === permission.id;
          const perm_ = role_.permissions.find(findPermissionById);
          if (!perm_) {
            addedPermissionsIds.push(permission.id);
          }
        }
      });
      const deletedPermissionsIds = [];
      role_.permissions.forEach((permission: Permission) => {
        const findPermissionById = (perm: Permission) => perm.id === permission.id;
        const perm_ = this.permissions.find(findPermissionById);
        if (!perm_.isEnabled) {
         deletedPermissionsIds.push(perm_.id);
        }
      });
      try {
        const result = await this.resource.editUserRole(role, null, {companyId: companyId, roleId: role.id});
        if (result.data) {
          role_.code = result.data.name;
          role_.title = result.data.display_name;
          role_.description = result.data.description;
          if (addedPermissionsIds.length > 0) {
            await this.addPermissions(addedPermissionsIds, role.id);
          }
          if (deletedPermissionsIds.length > 0) {
            await this.deletePermissions(deletedPermissionsIds, role.id);
          }
          return role_;
        }
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  }

  /**
   * Удаление роли пользователя
   * @param {number} companyId - Идентификатор компании
   * @param {number} roleId - Идентификатор роли пользователя
   * @returns {Promise<boolean>}
   */
  async deleteUserRole(companyId: number, roleId: number): Promise<boolean> {
    try {
      const result = await  this.resource.deleteUserRole({companyId: companyId, roleId: roleId});
      if (result.meta['success'] && result.meta['success'] === true) {
        this.roles.forEach((role: Role, index: number, array: Role[]) => {
          if (role.id === roleId) {
            this.roles.splice(index, 1);
          }
        });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * Добавление права пользователя к роли
   * @param {number[]} permissionsIds - Массив идентификаторо прав пользователя
   * @param {number} roleId -Идентификатор роли пользователя
   * @returns {Promise<boolean>}
   */
  async addPermissions(permissionsIds: number[], roleId: number): Promise<boolean> {
    try {
      const result = await this.resource.addPermissions({permissions_ids: permissionsIds}, null, {roleId: roleId});
      if (result.data) {
        const findRoleById = (item: Role) => item.id === roleId;
        const role = this.roles.find(findRoleById);
        if (role) {
          permissionsIds.forEach((id: number) => {
            this.permissions.forEach((permission: Permission) => {
              if (permission.id === id) {
                role.permissions.push(permission);
              }
            });
          });
        }
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * Удаление прав пользователя из роли
   * @param {number[]} permissionsIds - Массив идентификаторов прав пользователя
   * @param {number} roleId - Идентификатор роли пользователя
   * @returns {Promise<boolean>}
   */
  async deletePermissions(permissionsIds: number[], roleId: number): Promise<boolean> {
    try {
      const result = await this.resource.deletePermissions({permissions_ids: permissionsIds}, null, {roleId: roleId});
      if (result.data) {
        const findRoleById = (item: Role) => item.id === roleId;
        const role = this.roles.find(findRoleById);
        role.permissions.forEach((item: Permission, index: number, array: Permission[]) => {
          const permission = permissionsIds.indexOf(item.id);
          if (permission !== -1) {
            array.splice(index, 1);
          }
        });
        return true;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * Добавление нового пользователя
   * @param {IUserDTO} user - Пользователь
   * @param {number} companyId - Идентификатор компании
   * @returns {Promise<User | null>}
   */
  async addUser(user: IUserDTO, companyId: number): Promise<User | null> {
    try {
      const result = await this.resource.addUser(user, null, {companyId: companyId});
      if (result.data) {
        const user_ = new User(result.data);
        this.users.push(user_);
        return user_;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * изменение пользователя
   * @param {IUserDTO} user - Пользователь
   * @param {number} companyId - Идентификатор компании
   * @returns {Promise<User | null>}
   */
  async editUser(user: IUserDTO, companyId: number): Promise<User | null> {
    try {
      this.isEditingUserInProgress = true;
      const result = await this.resource.editUser(user, null, {companyId: companyId, userId: user.id});
      if (result.data) {
        this.isEditingUserInProgress = false;
        const editedUser = new User(result.data);
        const findUserById = (usr: User) => usr.id === user.id;
        const user_ = this.users.find(findUserById);
        if (user_) {
          user_.firstName = user.first_name;
          user_.secondName = user.patronymic;
          user_.lastName = user.last_name;
          user_.email = user.email;
          user_.phone = user.phone;
          user_.roles = editedUser.roles;
          user_.generateRolesLabel();
          return user_;
        }
      }
    } catch (error) {
      console.error(error);
      this.isEditingUserInProgress = false;
      return null;
    }
  }

  /**
   * Удаление пользователя
   * @param {number} companyId - Идентификатор компании
   * @param {number} userId - Идентификатор пользователя
   * @returns {Promise<boolean>}
   */
  async deleteUser(companyId: number, userId: number): Promise<boolean> {
    try {
      const result = await this.resource.deleteUser({companyId: companyId, userId: userId});
      if (result.meta['success'] && result.meta['success'] === true) {
        this.users.forEach((user: User, index: number, array: User[]) => {
          if (user.id === userId) {
            array.splice(index, 1);
            return true;
          }
        });
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * Активация / деактивация пользователя
   * @param {number} userId - Идентификатор пользователя
   * @param {boolean} isActive - Флаг активности
   * @returns {Promise<boolean>}
   */
  async setUserStatus(userId: number, isActive: boolean): Promise<boolean> {
    try {
      this.isSettingUserStatusInProgress = true;
      const result = await this.resource.setUserStatus({target_user_id: userId, status: isActive ? 1 : 0 });
      if (result.meta['success'] && result.meta['success'] === true) {
        this.isSettingUserStatusInProgress = false;
        const findUserById = (item: User) => item.id === userId;
        const user = this.users.find(findUserById);
        if (user) {
          user.isActive = isActive;
        }
      }
    } catch (error) {
      console.error(error);
      this.isSettingUserStatusInProgress = false;
      return null;
    }
  }
}
