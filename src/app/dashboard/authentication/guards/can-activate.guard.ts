import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Router } from '@angular/router';
import { User } from '../../../dashboard/users/models/user.model';
import { AuthenticationService } from '../../../dashboard/authentication/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private readonly router: Router,
              private readonly authenticationService: AuthenticationService) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (!this.authenticationService.getCurrentUser()) {
      const result = await this.authenticationService.check();
      if (result) {
        this.router.navigate(['/surveys']);
      } else {
        return true;
      }
    } else {
      this.router.navigate(['/surveys']);
    }
  }
}
