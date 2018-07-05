import { Restaurant } from '../../restaurants/models/restaurant.model';
import { IRestaurantComparsionDTO } from '../dto/restaurant-comparsion.dto';

export class Comparsion {
  restaurant: Restaurant;
  stat: {
    type: string;
    value: number
  };

  constructor(config?: IRestaurantComparsionDTO) {
    this.restaurant = new Restaurant(config.restaurant.data);
    this.stat = {
      type: null,
      value: null
    };
    this.stat.type = config ? config.restaurant.value.type : null;
    this.stat.value = config ? config.restaurant.value.value : null;
  }
}
