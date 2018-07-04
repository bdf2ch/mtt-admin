import { Injectable } from '@angular/core';
import { RestaurantsResource } from '../resources/restaurants.resource';
import { Restaurant  } from '../models/restaurant.model';
import { IRestaurantDTO } from '../dto/restaurant.dto';
import { TimeTable } from '../models/time-table.model';
import { ITimeTableDTO } from '../dto/time-table.dto';
import { ISocialNetworkDTO } from '../dto/social-network.dto';
import { SocialNetwork } from '../models/social-network.model';
import { SocialNetworkType } from '../models/social-network-type.model';
import { IAddressDTO } from '../dto/address.dto';
import { Address } from '../models/address.model';
import { ISocialNetworkType } from '../interfaces/social-network-type.interface';

@Injectable({
  providedIn: 'root'
})
export class RestaurantsService {
  private restaurants: Restaurant[];
  private socialNetworkTypes: SocialNetworkType[];
  private isAddingRestaurantInProgress: boolean;
  private isEditingRestaurantInProgress: boolean;
  private isDeletingRestaurantInProgress: boolean;

  constructor(private readonly resource: RestaurantsResource) {
    this.restaurants = [];
    this.socialNetworkTypes = [];
    this.isAddingRestaurantInProgress = false;
    this.isEditingRestaurantInProgress = false;
  }

  /**
   * Выполняется ли добавление данных о ресторане
   * @returns {boolean}
   */
  addingRestaurantInProgress(): boolean {
    return this.isAddingRestaurantInProgress;
  }

  /**
   * Выполняется ли сохранение данных о ресторане
   * @returns {boolean}
   */
  editingRestaurantInProgress(): boolean {
    return this.isEditingRestaurantInProgress;
  }

  /**
   * Выполняется ли удаление ресторана
   * @returns {boolean}
   */
  deletingRestaurantInProgress(): boolean {
    return this.isDeletingRestaurantInProgress;
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
        this.restaurants = [];
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
  async addRestaurantInfo(restaurant: IRestaurantDTO, companyId: number): Promise<Restaurant | null> {
    this.isAddingRestaurantInProgress = true;
    try {
      const result = await this.resource.addRestaurant(restaurant, null, {id: companyId});
      console.log(result);
      if (result.data) {
        this.isAddingRestaurantInProgress = false;
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
   * Изменение информации о ресторвне
   * @param {IRestaurantDTO} restaurant - Ресторан
   * @param {number} companyId - Идентификатор компании
   * @returns {Promise<Restaurant | null>}
   */
  async editRestaurantInfo(restaurant: IRestaurantDTO, companyId: number): Promise<Restaurant | null> {
    this.isEditingRestaurantInProgress = true;
    try {
      const result = await this.resource.editRestaurant(restaurant, null, {companyId: companyId, restaurantId: restaurant.id});
      if (result.data) {
        this.restaurants.forEach((item: Restaurant) => {
          if (item.id === restaurant.id) {
            item.title = restaurant.name;
            item.phone = restaurant.phone;
            item.www = restaurant.site;
            item.rKeeperConfig.id = restaurant.rKeeperConfig.id;
            return item;
          }
        });
      }
    } catch (error) {
      console.error(error);
      this.isEditingRestaurantInProgress = false;
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
        this.isDeletingRestaurantInProgress = false;
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
   * Добавление адреса ресторана
   * @param {IAddressDTO} address - Адрес ресторана
   * @param {number} restaurantId - Идентификатор ресторана
   * @returns {Promise<Address | null>}
   */
  async addAddress(address: IAddressDTO, restaurantId: number): Promise<Address | null> {
    try {
      const result = await this.resource.addAddress(address, null, {restaurantId: restaurantId});
      if (result.data) {
        const address_ = new Address(result.data);
        this.restaurants.forEach((item: Restaurant) => {
          if (item.id === restaurantId) {
            item.address = address_;
          }
        });
        return address_;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Изменение адреса ресторана
   * @param {IAddressDTO} address - Адрес ресторана
   * @param {number} restaurantId - Идентификатор ресторана
   * @returns {Promise<Address | null>}
   */
  async editAddress(address: IAddressDTO, restaurantId: number): Promise<Address | null> {
    try {
      const result = await this.resource.editAddress(address, null, {restaurantId: restaurantId, addressId: address.id});
      if (result.data) {
        const address_ = new Address(result.data);
        this.restaurants.forEach((item: Restaurant) => {
          if (item.id === restaurantId) {
            item.address = address_;
          }
        });
        return address_;
      }
    } catch (error) {
      console.error(error);
      return null;
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
      const result = await this.resource.addTimeTable(timeTable, null, {restaurantId: restaurantId});
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
   * Изменение расписания работы ресторана
   * @param {ITimeTableDTO} timeTable - Расписание работы
   * @param {number} restaurantId - Идентификатор ресторан
   * @returns {Promise<TimeTable | null>}
   */
  async editTimeTable(timeTable: ITimeTableDTO, restaurantId: number): Promise<TimeTable | null> {
    try {
      const result = await this.resource.editTimeTable(timeTable, null, {timeTableId: timeTable.id, restaurantId: restaurantId});
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
   * Получение списка всех типов социальных сетей
   * @returns {Promise<SocialNetworkType[] | null>}
   */
  async fetchSocialNetworkTypes(): Promise<SocialNetworkType[] | null> {
    try {
      const result = await this.resource.getSocialNetworkTypes();
      if (result.data) {
        for (const network in result.data) {
          const socialNetworkType: ISocialNetworkType = {
            code: network,
            title: result.data[network]
          };
          this.socialNetworkTypes.push(socialNetworkType);
        }

        return this.socialNetworkTypes;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Добавление социальнйо сети
   * @param {ISocialNetworkDTO} network - Социальная сеть
   * @param {number} restaurantId - Идентификатор ресторана
   * @returns {Promise<SocialNetwork | null>}
   */
  async addSocialNetwork(network: ISocialNetworkDTO, restaurantId: number): Promise<SocialNetwork | null> {
    try {
      const result = await this.resource.addSocialNetwork(network, null, {restaurantId: restaurantId});
      if (result.data) {
        const network_ = new SocialNetwork(result.data);
        this.restaurants.forEach((item: Restaurant) => {
          if (item.id === restaurantId) {
            item.social.push(network_);
          }
        });
        return network_;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Удаление соцмальной сети
   * @param {ISocialNetworkDTO} socialNetwork - Социальная сеть
   * @param {number} restaurantId - Идентификатор ресторана
   * @returns {Promise<boolean>}
   */
  async deleteSocialNetwork(socialNetworkId: number, restaurantId: number): Promise<boolean> {
    try {
      const result = await this.resource.deleteSocialNetwork({restaurantId: restaurantId, socialNetworkId: socialNetworkId});
      if (result.meta['success'] && result.meta['success'] === true) {
        this.restaurants.forEach((item: Restaurant) => {
          if (item.id === restaurantId) {
            item.social.forEach((social: SocialNetwork, index: number, array: SocialNetwork[]) => {
              if (social.id === socialNetworkId) {
                array.splice(index, 1);
              }
            });
          }
        });
        return true;
      }
      console.log(result);
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * Добавление ресторана
   * @param {number} companyId - Идентфиикатор компании
   * @param {IRestaurantDTO} info - Информация о ресторане
   * @param {IAddressDTO} address - Адрес ресторана
   * @param {ITimeTableDTO} time - Расписание работы ресторана
   * @param {ISocialNetworkDTO[]} socials - Список социальный сетей
   * @returns {Promise<void>}
   */
  async addRestaurant(companyId: number, info: IRestaurantDTO, address: IAddressDTO, time: ITimeTableDTO, socials: ISocialNetworkDTO[]) {
      this.isAddingRestaurantInProgress = true;
      const restaurant = await this.addRestaurantInfo(info, companyId);
      await this.addAddress(address, restaurant.id);
      await this.addTimeTable(time, restaurant.id);
      socials.forEach(async (social: ISocialNetworkDTO) => {
        await this.addSocialNetwork(social, restaurant.id);
      });
      this.isAddingRestaurantInProgress = false;
  }


  /**
   * Изменение ресторана
   * @param {number} companyId - Идентификатор клмпании
   * @param {IRestaurantDTO} info - Информация о ресторане
   * @param {IAddressDTO} address - Адрес ресторана
   * @param {ITimeTableDTO} time - Расписание работы ресторана
   * @param {ISocialNetworkDTO[]} socials - Список социальных сетей
   * @returns {Promise<void>}
   */
  async editRestaurant(companyId: number, info: IRestaurantDTO, address: IAddressDTO, time: ITimeTableDTO, socials: ISocialNetworkDTO[]) {
    const findRestaurantById = (item: Restaurant) => item.id === info.id;
    const restaurant = this.restaurants.find(findRestaurantById);
    if (restaurant) {
      this.isEditingRestaurantInProgress = true;
      await this.editRestaurantInfo(info, companyId);
      await this.editAddress(address, restaurant.id);
      await this.editTimeTable(time, restaurant.id);
      restaurant.social.forEach(async (item: SocialNetwork) => {
        const findSocialNetworkById = (social: ISocialNetworkDTO) => item.id === social.id;
        const socialNetwork = socials.find(findSocialNetworkById);
        if (!socialNetwork) {
          await this.deleteSocialNetwork(item.id, restaurant.id);
        }
      });
      socials.forEach(async (item: ISocialNetworkDTO) => {
        const findSocialNetworkById = (social: SocialNetwork) => item.id === social.id;
        const socialNetwork = restaurant.social.find(findSocialNetworkById);
        if (!socialNetwork) {
          await this.addSocialNetwork(item, restaurant.id);
        }
      });
      this.isEditingRestaurantInProgress = false;
    }
  }
  /**
   * Возвращает список всех ресторанов
   * @returns {Restaurant[]}
   */
  getRestaurants(): Restaurant[] {
    return this.restaurants;
  }

  /**
   * Возвращает список всех типов социальных сетей
   * @returns {SocialNetworkType[]}
   */
  getSocialNetworkTypes(): SocialNetworkType[] {
    return this.socialNetworkTypes;
  }
}
