import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UsersService } from '../services/users.service';
import { AuthenticationService } from '../../authentication/services/authentication.service';
import { Role } from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleListGuard implements Resolve<Role[]> {
  constructor(private readonly authenticationService: AuthenticationService,
              private readonly usersService: UsersService) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Role[]> {
    await this.usersService.fetchPermissions();
    const roles = await this.usersService.fetchUserRolesByCompanyId(this.authenticationService.getCurrentUser().companyId);
    return roles;
  }

}
