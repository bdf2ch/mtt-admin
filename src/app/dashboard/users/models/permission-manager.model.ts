import { Permission } from './permission.model';
import { Role } from './role.model';

export class PermissionManager {
  private roles: Role[];
  private permissions: Permission[];

  constructor(config?: Role[]) {
    this.roles = [];
    this.permissions = [];
    if (config) {
      config.forEach((role: Role) => {
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
