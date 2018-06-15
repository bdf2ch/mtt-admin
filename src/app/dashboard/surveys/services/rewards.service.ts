import { Injectable } from '@angular/core';
import { RewardsResource } from '../resources/rewards.resource';
import { RewardType } from '../models/reward-type.model';
import { IRewardType } from '../interfaces/reward-type.interface';
import { Reward } from '../models/reward.model';
import {IRewardDTO} from '../dto/reward.dto';

@Injectable({
  providedIn: 'root'
})
export class RewardsService {
  private rewardTypes: RewardType[];
  private rewards: Reward[];

  constructor(private readonly resource: RewardsResource) {
    this.rewardTypes = [];
    this.rewards = [];
  }

  /**
   * Получение списка всех типов вознаграждений
   * @returns {Promise<RewardType[] | null>}
   */
  async fetchRewardTypes(): Promise<RewardType[] | null> {
    try {
      const result = await this.resource.getRewardTypes();
      if (result.data) {
        for (const reward in result.data) {
          const rewardType: IRewardType = {
            code: reward,
            title: result.data[reward]
          };
          this.rewardTypes.push(rewardType);
        }
        return this.rewardTypes;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Получение списка вознаграждений
   * @param {number} companyId - Идентификатор компании
   * @returns {Promise<Reward[] | null>}
   */
  async fetchRewards(companyId: number): Promise<Reward[] | null> {
    try {
      const result = await this.resource.getRewards({companyId: companyId});
      if (result.data) {
        result.data.forEach((item: IRewardDTO) => {
          const reward = new Reward(item);
          this.rewards.push(reward);
        });
        return this.rewards;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Возвращает список типов вознаграждений
   * @returns {RewardType[]}
   */
  getRewardTypes(): RewardType[] {
    return this.rewardTypes;
  }

  /**
   * Возвращает список вознаграждений
   * @returns {Reward[]}
   */
  getRewardsList(): Reward[] {
    return this.rewards;
  }
}
