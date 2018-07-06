import { Question } from './question.model';
import { IReportDTO } from '../dto/report.dto';
import { IQuestionDTO } from '../dto/question.dto';
import { Restaurant } from '../../restaurants/models/restaurant.model';

export class ComparsionReport {
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
        if (item.form.data.type === 'mark') {
          const question = new Question(item);
          this.questions.push(question);
        }
      });
      if (config.questionnaire_results) {
        this.views.total = config.questionnaire_results.total;
        this.views.notViewed = config.questionnaire_results.not_viewed;
      }
    }
  }
}
