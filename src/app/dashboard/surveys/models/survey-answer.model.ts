import { Question} from './question.model';
import { ISurveyAnswerDTO } from '../dto/survey-answer.dto';

/**
 * Класс, реализуцющий ответ на опрос
 */
export class SurveyAnswer {
  questionId: number;                       // Идентификатор вопроса
  surveyResultId: number;                   // Идентификатор результата опроса
  formAnswerId: number;                     // Идентфиикатор формы ответа
  clientId: string;                         // Идентификато рклиента
  questionFormRangeId: number | null;       // Идентификатор диапазона
  value: string;                            // Ответ
  question: Question | null;                // Вопрос

  /**
   * Конструктор
   * @param {ISurveyAnswerDTO} config - Параметры инициализации
   */
  constructor(config?: ISurveyAnswerDTO) {
    this.questionId = config ? config.question_id : 0;
    this.surveyResultId = config ? config.questionnaire_result_id : 0;
    this.formAnswerId = config ? config.form_answer_id : 0;
    this.clientId = config ? config.client_id : null;
    this.questionFormRangeId = config ? config.question_form_range_id : null;
    this.value = config ? config.value : null;
    this.question = config ? new Question(config.question.data) : null;
  }
}
