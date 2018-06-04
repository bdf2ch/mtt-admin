import { Injectable } from '@angular/core';
import { RestaurantsResource } from '../resources/restaurants.resource';
import { Restaurant  } from '../models/restaurant.model';
import { IRestaurant } from '../interfaces/restaurant.interface';
import { IRestaurantDTO } from '../dto/restaurant.dto';
import {TimeTable} from '../models/time-table.model';
import {ITimeTableDTO} from '../dto/time-table.dto';
import {PaymentRequisites} from '../../company/models/payment-requisites.model';

@Injectable({
  providedIn: 'root'
})
export class RestaurantsService {
  private restaurants: Restaurant[];
  private isAddingRestaurantInProgress: boolean;
  private isDeletingRestaurantInProgress: boolean;

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
   * Удвление ресторана
   * @param {number} companyId - Идентфикатор компании
   * @param {number} restaurantId - Идентификатор ресторана
   * @returns {Promise<boolean>}
   */
  async deleteRestaurant(companyId: number, restaurantId: number): Promise<boolean> {
    this.isDeletingRestaurantInProgress = true;
    try {
      const result = await this.resource.deleteRestaurant(null, null, {companyId: companyId, restaurantId: restaurantId});
      if (result.meta['success'] && result.meta['success'] === true) {
        this.restaurants.forEach((item: Restaurant, index: number, array: Restaurant[]) => {
          if (item.id === restaurantId) {
            array.splice(index, 1);
          }
        });
        return true;
      }
      console.log(result);
    } catch (error) {
      console.error(error);
      this.isDeletingRestaurantInProgress = false;
      return false;
    }
  }


  /**
   * Добавление расписания работы ресторана
   * @param {ITimeTableDTO} timeTable - Расписание работы
   * @param {number} restaurantId - Идентфикатор ресторана
   * @returns {Promise<TimeTable | null>}
   */
  async addTimeTable(timeTable: ITimeTableDTO, restaurantId: number): Promise<TimeTable | null> {
    try {
      const result = await this.resource.addTimeTable(timeTable, null, {id: restaurantId});
      if (result.data) {
        const timeTable_ = new TimeTable(result.data);
        this.restaurants.forEach((item: Restaurant) => {
          if (item.id === restaurantId) {
            item.timeTable = timeTable_;
          }
        });
        return timeTable_;
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
