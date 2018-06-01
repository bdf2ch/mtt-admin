import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Restaurant } from '../models/restaurant.model';
import { AuthenticationService } from '../../authentication/services/authentication.service';
import { RestaurantsService } from '../services/restaurants.service';

@Injectable({
  providedIn: 'root'
})
export class RestaurantsResolveGuard implements Resolve<Promise<Restaurant[]>> {
  constructor(private readonly authenticationService: AuthenticationService,
              private readonly restaurantsService: RestaurantsService) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Restaurant[]> {
    const result = await this.restaurantsService.fetchRestaurantsByCompanyId(this.authenticationService.getCurrentUser().companyId);
    return result;
  }
}
