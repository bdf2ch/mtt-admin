import { Injectable } from '@angular/core';
import { RestaurantsResource } from '../resources/restaurants.resource';
import { Restaurant  } from '../models/restaurant.model';
import { IRestaurant } from '../interfaces/restaurant.interface';
import { IRestaurantDTO } from '../dto/restaurant.dto';

@Injectable({
  providedIn: 'root'
})
export class RestaurantsService {
  private restaurants: Restaurant[];
  private isAddingRestaurantInProgress: boolean;

  constructor(private readonly resource: RestaurantsResource) {
    this.restaurants = [];
    this.isAddingRestaurantInProgress = false;
  }

  /**
   * Добавляется ли ресторан
   * @returns {boolean}
   */
  addingRestaurantInProgress(): boolean {
    return this.isAddingRestaurantInProgress;
  }

  /**
   * Получение списка ресторанов по идентификатору компании
   * @param {number} companyId - Идентификатор компании
   * @returns {Promise<Restaurant[] | null>}
   */
  async fetchRestaurantsByCompanyId(companyId: number): Promise<Restaurant[] | null> {
    try {
      const result = await this.resource.getRestaurantsByCompanyId({ id: companyId });
      if (result.data) {
        result.data.forEach((item: IRestaurantDTO) => {
          const restaurant = new Restaurant(item);
          this.restaurants.push(restaurant);
        });
        return this.restaurants;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Добавление ресторана
   * @param {IRestaurantDTO} restaurant - Информация о ресторане
   * @param {number} companyId - Идентификатор ресторана
   * @returns {Promise<Restaurant | null>}
   */
  async addRestaurant(restaurant: IRestaurantDTO, companyId: number): Promise<Restaurant | null> {
    this.isAddingRestaurantInProgress = true;
    try {
      const result = await this.resource.addRestaurant(restaurant, null, {id: companyId});
      console.log(result);
      if (result.data) {
        const rest = new Restaurant(result.data);
        this.restaurants.push(rest);
        return rest;
      }
    } catch (error) {
      console.error(error);
      this.isAddingRestaurantInProgress = false;
      return null;
    }
  }

  /**
   * Возвращает список всех ресторанов
   * @returns {Restaurant[]}
   */
  getRestaurants(): Restaurant[] {
    return this.restaurants;
  }
}
