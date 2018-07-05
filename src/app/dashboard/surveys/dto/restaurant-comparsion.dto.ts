import { IRestaurantDTO } from '../../restaurants/dto/restaurant.dto';

export interface IRestaurantComparsionDTO {
  restaurant: {
    data: IRestaurantDTO,
    value: {
      value: number;
      type: string;
    }
  };
}
