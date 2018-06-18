import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../authentication/services/authentication.service';
import { Survey } from '../models/survey.model';
import { SurveysService } from '../services/surveys.service';
import {RestaurantsService} from '../../restaurants/services/restaurants.service';
import {RewardsService} from '../services/rewards.service';

@Injectable({
  providedIn: 'root'
})
export class SurveysResolveGuard implements Resolve<Promise<Survey[]>> {
  constructor(private readonly authenticationService: AuthenticationService,
              private readonly surveysService: SurveysService,
              private readonly rewardsSevice: RewardsService,
              private readonly restaurantsService: RestaurantsService) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Survey[]> {
    if (this.rewardsSevice.getRewardsList().length === 0) {
      await this.rewardsSevice.fetchRewards(this.authenticationService.getCurrentUser().companyId);
    }
    if (this.surveysService.getSurveysList().length === 0) {
      await this.surveysService.fetchSurveyList();
    }
    if (this.restaurantsService.getRestaurants().length === 0) {
      await this.restaurantsService.fetchRestaurantsByCompanyId(this.authenticationService.getCurrentUser().companyId);
    }
    return this.surveysService.getSurveysList();
  }
}
