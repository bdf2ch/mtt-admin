import { ISurvey } from '../interfaces/survey.interface';
import { ISurveyDTO } from '../dto/survey.dto';
import { Restaurant } from '../../restaurants/models/restaurant.model';
import { IRestaurantDTO } from '../../restaurants/dto/restaurant.dto';
import { Question } from './question.model';
import {IQuestionDTO} from '../dto/question.dto';

/**
 * Класс, реализующий интерфейс опроса
 */
export class Survey implements ISurvey {
  id: number;                       // Идентификатор
  companyId: number;                // Идентфиикатор компании
  rewardId: number;                 // Идентификатор вознаграждения
  title: string;                    // Наименование
  description?: string | null;      // Описание
  start: Date | null;               // Дата начала
  end?: Date | null;                // Дата окончания
  passingCount: number;             // Число возможных прохождений
  passedCount: number;              // Число завершенных прохождений
  isTemplate: boolean;              // Является ли шаблоном
  isActive: boolean;                // Является ли активным
  restaurants?: Restaurant[];       // Массив ресторанов, в которых проводится опрос
  needClientDataFirst?: boolean;    // Спрашивать контакты в начале
  questions: Question[];            // Вопросы

  /**
   * Конструктор
   * @param {ISurveyDTO} config - Параметры инициализации
   */
  constructor(config?: ISurveyDTO) {
    this.id = config ? config.id : 0;
    this.companyId = config ? config.company_id : 0;
    this.rewardId = config ? config.reward_id : 0;
    this.title = config ? config.name : '';
    this.description = config && config.description ? config.description : null;
    this.start = config ? new Date(config.from) : new Date();
    this.end = config && config.to ? new Date(config.to) : null;
    this.passingCount = config ? config.available_passing_count : 0;
    this.passedCount = config && config.passed_count ? config.passed_count : 0;
    this.isTemplate = config ? config.is_template : false;
    this.isActive = config ? config.is_active : false;
    this.needClientDataFirst = config && config.need_client_data_first ? config.need_client_data_first : true;
    this.restaurants = [];
    this.questions = [];

    if (config && config.restaurants) {
      config.restaurants.data.forEach((item: IRestaurantDTO) => {
        const restaurant = new Restaurant(item);
        this.restaurants.push(restaurant);
      });
    }

    if (config && config.questions) {
      config.questions.data.forEach((item: IQuestionDTO) => {
        const question = new Question(item);
        this.questions.push(question);
      });
    }
  }
}
