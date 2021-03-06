import { Question } from './question.model';
import { IReportDTO } from '../dto/report.dto';
import { IQuestionDTO } from '../dto/question.dto';
import { Restaurant } from '../../restaurants/models/restaurant.model';
import { IRestaurantDTO } from '../../restaurants/dto/restaurant.dto';

export class Report {
  questions: Question[];
  restaurants: Restaurant[];
  views: {
    total: number;
    notViewed: number;
  };

  constructor(config?: IReportDTO) {
    this.questions = [];
    this.restaurants = [];
    this.views = {
      total: null,
      notViewed: null
    };

    if (config) {
      console.log(config);
      config.questions.data.forEach((item: IQuestionDTO) => {
        if (item.form.data.type !== 'text_input') {
          const question = new Question(item);
          this.questions.push(question);
        }
      });
      config.restaurant_marks.data.forEach((item: IRestaurantDTO) => {
        const restaurant = new Restaurant(item);
        this.restaurants.push(restaurant);
      });

      if (config.questionnaire_results) {
        this.views.total = config.questionnaire_results.total;
        this.views.notViewed = config.questionnaire_results.not_viewed;
      }
    }
  }
}
