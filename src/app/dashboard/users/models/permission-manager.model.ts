import { Permission } from './permission.model';
import { Role } from './role.model';
import { IRole } from '../interfaces/role.interface';

export class PermissionManager {
  private roles: Role[];
  private permissions: Permission[];

  constructor(config?: Role[]) {
    this.roles = [];
    this.permissions = [];
    if (config) {
      console.log('perm config', config);
      config.forEach((role: Role) => {
        const findRoleById = (item: Role) => item.id === role.id;
        const role_ = this.roles.find(findRoleById);
        if (!role_) {
          this.roles.push(role);
        }
        role.permissions.forEach((permission: Permission) => {
          const findPermissionByCode = (item: Permission) => item.code === permission.code;
          const permission_ = this.permissions.find(findPermissionByCode);
          if (!permission_) {
            this.permissions.push(permission);
          }
        });
      });
    }
  }

  getByCode(code: string): Permission | null {
    const findPermissionByCode = (item: Permission) => item.code === code;
    const permission = this.permissions.find(findPermissionByCode);
    return permission ? permission : null;
  }

}
