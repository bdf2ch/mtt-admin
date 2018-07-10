import { IQuestionDTO } from './question.dto';
import { IRestaurantDTO } from '../../restaurants/dto/restaurant.dto';

export interface IReportDTO {
  questions: {
    data: IQuestionDTO[];
  };
  restaurant_marks: {
    data: IRestaurantDTO[];
  };
  questionnaire_results?: {
    not_viewed: number;
    total: number;
  };
  meta?: {
    page: number;
    last_page: number;
    total: number;
  };
}

