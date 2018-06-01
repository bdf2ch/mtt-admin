import { Injectable } from '@angular/core';
import { RestaurantsResource } from '../resources/restaurants.resource';
import { Restaurant  } from '../models/restaurant.model';
import { IRestaurant } from '../interfaces/restaurant.interface';
import { IRestaurantDTO } from '../dto/restaurant.dto';

@Injectable({
  providedIn: 'root'
})
export class RestaurantsService {
  restaurants: Restaurant[];

  constructor(private readonly resource: RestaurantsResource) {
    this.restaurants = [];
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
   * Возвращает список всех ресторанов
   * @returns {Restaurant[]}
   */
  getRestaurants(): Restaurant[] {
    return this.restaurants;
  }
}
