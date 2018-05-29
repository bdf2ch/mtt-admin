import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UsersService } from '../services/users.service';
import { AuthenticationService } from '../../authentication/services/authentication.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserListGuard implements Resolve<User[]> {
  constructor(private readonly authenticationService: AuthenticationService,
              private readonly usersService: UsersService) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<User[]> {
    await this.usersService.fetchUsersByCompanyId(this.authenticationService.getCurrentUser().companyId);
    return this.usersService.getUserList();
  }

}
