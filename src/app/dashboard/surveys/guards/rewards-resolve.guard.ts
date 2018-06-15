import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../authentication/services/authentication.service';
import { RewardType } from '../models/reward-type.model';
import { RewardsService } from '../services/rewards.service';

@Injectable({
  providedIn: 'root'
})
export class RewardsResolveGuard implements Resolve<Promise<RewardType[]>> {
  constructor(private readonly authenticationService: AuthenticationService,
              private readonly rewardService: RewardsService) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<RewardType[]> {
    if (this.rewardService.getRewardTypes().length === 0) {
      await this.rewardService.fetchRewardTypes();
    }
    if (this.rewardService.getRewardsList().length === 0) {
      await this.rewardService.fetchRewards(this.authenticationService.getCurrentUser().companyId);
    }
    return this.rewardService.getRewardTypes();
  }
}
