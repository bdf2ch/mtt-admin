import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../authentication/services/authentication.service';
import { Survey } from '../models/survey.model';
import { SurveysService } from '../services/surveys.service';
import { RestaurantsService } from '../../restaurants/services/restaurants.service';
import { RewardsService } from '../services/rewards.service';

@Injectable({
  providedIn: 'root'
})
export class SurveyResolveGuard implements Resolve<Promise<Survey[]>> {
  constructor(private readonly authenticationService: AuthenticationService,
              private readonly surveysService: SurveysService,
              private readonly rewardsService: RewardsService,
              private readonly restaurantsService: RestaurantsService) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Survey[]> {
    console.log('survey resolve');
    if (this.rewardsService.getRewardsList().length === 0) {
      await this.rewardsService.fetchRewards(this.authenticationService.getCurrentUser().companyId);
    }
    if (this.surveysService.getSurveysList().length === 0) {
      await this.surveysService.fetchSurveyList();
      const surveyId = route.params['id'] ? parseInt(route.params['id']) : null;
      console.log('surveyId', surveyId);
      if (surveyId) {
        const survey = this.surveysService.getSurveyById(surveyId);
        console.log(survey);
        this.surveysService.selectedSurvey(survey);
      }
    }
    if (this.restaurantsService.getRestaurants().length === 0) {
      await this.restaurantsService.fetchRestaurantsByCompanyId(this.authenticationService.getCurrentUser().companyId);
    }
    return this.surveysService.getSurveysList();
  }
}
