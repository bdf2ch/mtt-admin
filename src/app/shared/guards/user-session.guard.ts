import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Router } from '@angular/router';
import { User } from '../../dashboard/users/models/user.model';
import { AuthenticationService } from '../../dashboard/authentication/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserSessionGuard implements CanActivate {
  constructor(private readonly router: Router,
              private readonly authenticationService: AuthenticationService) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (!this.authenticationService.getCurrentUser()) {
      const result: User | null = await this.authenticationService.check();
      if (result) {
        return true;
      } else {
        this.router.navigate(['/auth']);
        return false;
      }
    } else {
      return true;
    }
  }
}
