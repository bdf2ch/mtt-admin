import { SurveyAnswer } from './survey-answer.model';
import { ISurveyResultDTO } from '../dto/survey-result.dto';
import { ISurveyAnswerDTO } from '../dto/survey-answer.dto';

/**
 * Класс результата ответа на опрос
 */
export class SurveyResult {
  id: number;                     // Идентификатор
  finished: Date;                 // Дата прохождения
  status: string;                 // Статус
  rewardId: number;               // Идентификатор вознаграждения
  surveyId: number;               // Идентификатор опроса
  restaurantId: number;           // Идентфиикатор ресторана
  clientId: string;               // Идентфиикатор клиента
  rewardCodeId: number;           // Идентификатор кода вознаграждения
  viewed: boolean;                // Просмотрен ли результат
  answers: SurveyAnswer[];        // Массив ответов

  /**
   * Конструктор
   * @param {ISurveyResultDTO} config - Параметры инициализации
   */
  constructor(config?: ISurveyResultDTO) {
    this.id = config ? config.id : 0;
    this.finished = config ? new Date(config.finished_at) : new Date();
    this.status = config ? config.status : null;
    this.rewardId = config ? config.reward_id : 0;
    this.surveyId = config ? config.questionnaire_id : 0;
    this.restaurantId = config ? config.restaurant_id : 0;
    this.clientId = config ? config.client_id : null;
    this.rewardCodeId = config ? config.reward_code_id : 0;
    this.viewed = config ? config.viewed : false;
    this.answers = [];

    if (config) {
      config.answers.data.forEach((item: ISurveyAnswerDTO) => {
        const answer = new SurveyAnswer(item);
        this.answers.push(answer);
      });
    }
  }
}
