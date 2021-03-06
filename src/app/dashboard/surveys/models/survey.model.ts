import { ISurvey } from '../interfaces/survey.interface';
import { ISurveyDTO } from '../dto/survey.dto';
import { Restaurant } from '../../restaurants/models/restaurant.model';
import { IRestaurantDTO } from '../../restaurants/dto/restaurant.dto';
import { Question } from './question.model';
import { IQuestionDTO } from '../dto/question.dto';
import { Template } from './template.model';
import { Footer } from './footer.model';
import {ITemplateDTO} from "../dto/template.dto";

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
  isDeletable: boolean;             // Является ли опрос удаляемым
  restaurants?: Restaurant[];       // Массив ресторанов, в которых проводится опрос
  needClientDataFirst?: boolean;    // Спрашивать контакты в начале
  questions: Question[];            // Вопросы
  header: Template;
  footer: Template;

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
    this.isDeletable = config ? config.is_deletable : false;
    this.needClientDataFirst = config && config.need_client_data_first ? config.need_client_data_first : true;
    this.header = null;
    this.footer = null;
    this.restaurants = [];
    this.questions = [];

    if (config && config.templates) {
      config.templates.data.forEach((template: ITemplateDTO) => {
        switch (template.type) {
          case 'header':
            this.header = new Template(template);
            break;
          case 'footer':
            this.footer = new Template(template);
            break;
        }
      });
    }

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

  getResturantsOptions(): any[] {
    const result = [];
    this.restaurants.forEach((item: Restaurant) => {
      result.push(item.asOption);
    });
    return result;
  }

  getQuestionsOptions(): any[] {
    const result = [];
    this.questions.forEach((item: Question) => {
      if (item.form.type === 'mark') {
        result.push(item.asOption);
      }
    });
    return result;
  }
}

