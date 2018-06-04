import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Restaurant } from '../models/restaurant.model';
import { AuthenticationService } from '../../authentication/services/authentication.service';
import { RestaurantsService } from '../services/restaurants.service';
import {CompanyService} from '../../company/services/company.service';

@Injectable({
  providedIn: 'root'
})
export class RestaurantsResolveGuard implements Resolve<Promise<Restaurant[]>> {
  constructor(private readonly authenticationService: AuthenticationService,
              private readonly companyService: CompanyService,
              private readonly restaurantsService: RestaurantsService) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Restaurant[]> {
    if (!this.companyService.getCompany()) {
      await this.companyService.fetchCompanyById(this.authenticationService.getCurrentUser().companyId);
    }
    const result = await this.restaurantsService.fetchRestaurantsByCompanyId(this.authenticationService.getCurrentUser().companyId);
    return result;
  }
}
