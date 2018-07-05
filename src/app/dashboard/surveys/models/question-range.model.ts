import { IRangeDTO } from '../dto/range.dto';

export class QuestionRange {
  id: number;                 // Идентификатор
  questionId: number;         // Идентфиикатор вопроса
  questionFormId: number;     // Идентификато рформы
  companyId: number;          // Идентификатор компании
  min: number;                // Минииальное значение
  max: number;                // Максимальное значенеи
  stat: {
    value: number;
    type: string;
  };

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
    this.stat = {
      value: null,
      type: null
    };
    this.stat.value = config && config.statistic ? config.statistic.data.value : null;
    this.stat.type = config && config.statistic ? config.statistic.data.type : null;
  }
}
