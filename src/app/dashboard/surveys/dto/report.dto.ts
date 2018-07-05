import {IQuestionDTO} from './question.dto';
import {IRestaurantDTO} from '../../restaurants/dto/restaurant.dto';

export interface IReportDTO {
  questions: {
    data: IQuestionDTO[];
  };
  restaurant_marks: {
    data: IRestaurantDTO[];
  };
}

