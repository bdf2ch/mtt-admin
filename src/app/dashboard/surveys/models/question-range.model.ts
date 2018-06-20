import { IRangeDTO } from '../dto/range.dto';

export class QuestionRange {
  id: number;                 // Идентификатор
  questionId: number;         // Идентфиикатор вопроса
  questionFormId: number;     // Идентификато рформы
  companyId: number;          // Идентификатор компании
  min: number;                // Минииальное значение
  max: number;                // Максимальное значенеи

  /**
   * Конструктор
   * @param {IRangeDTO} config - Параметры инициализации
   */
  constructor(config?: IRangeDTO) {
    this.id = config ? config.id : 0;
    this.questionId = config ? config.question_id : 0;
    this.questionFormId = config ? config.question_form_id : 0;
    this.companyId = config ? config.company_id : 0;
    this.min = config ? config.min : 0;
    this.max = config ? config.max : 0;
  }
}
