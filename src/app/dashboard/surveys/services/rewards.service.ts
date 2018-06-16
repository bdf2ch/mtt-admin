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
  private isAddingRewardInProgress: boolean;
  private isEditingRewardInProgress: boolean;
  private isDeletingRewardInProgress: boolean;

  constructor(private readonly resource: RewardsResource) {
    this.rewardTypes = [];
    this.rewards = [];
    this.isAddingRewardInProgress = false;
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
   * Добавление вознаграждения
   * @param {IRewardDTO} reward - Вознаграждение
   * @param {number} companyId - Идентификатор компании
   * @returns {Promise<Reward | null>}
   */
  async addReward(reward: IRewardDTO, companyId: number): Promise<Reward | null> {
    try {
      const result = await this.resource.addReward(reward, null, {companyId: companyId});
      if (result.data) {
        const reward_ = new Reward(result.data);
        this.rewards.push(reward_);
        return reward_;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  /**
   * Удаление вознаграждения
   * @param {IRewardDTO} reward - Вознаграждение
   * @param {number} companyId - Идентификатор компании
   * @returns {Promise<boolean>}
   */
  async deleteReward(reward: Reward, companyId: number): Promise<boolean> {
    try {
      const result = await this.resource.deleteReward({companyId: companyId, rewardId: reward.id});
      if (result.meta['success'] && result.meta['success'] === true) {
        this.rewards.forEach((item: Reward, index: number, array: Reward[]) => {
          if (item.id === reward.id) {
            array.splice(index, 1);
            return true;
          }
        });
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
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

  /**
   * Выполняется ли добавление вознаграждения
   * @returns {boolean}
   */
  addingRewardInProgress(): boolean {
    return this.isAddingRewardInProgress;
  }

  /**
   * Выполняется ли изменение вознаграждения
   * @returns {boolean}
   */
  editingRewardInProgress(): boolean {
    return this.isEditingRewardInProgress;
  }

  /**
   * Выполняется ли удаление вознаграждения
   * @returns {boolean}
   */
  deletingRewardInProgress(): boolean {
    return this.isDeletingRewardInProgress;
  }
}
