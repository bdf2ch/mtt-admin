import { Question } from './question.model';
import { IReportDTO } from '../dto/report.dto';
import { IQuestionDTO } from '../dto/question.dto';
import { Restaurant } from '../../restaurants/models/restaurant.model';

export class ComparsionReport {
  questions: Question[];
  restaurants: Restaurant[];

  constructor(config?: IReportDTO) {
    this.questions = [];
    this.restaurants = [];

    if (config) {
      console.log(config);
      config.questions.data.forEach((item: IQuestionDTO) => {
        if (item.form.data.type === 'mark') {
          const question = new Question(item);
          this.questions.push(question);
        }
      });
    }
  }
}
