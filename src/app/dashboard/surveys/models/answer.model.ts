import { IAnswerDTO } from '../dto/answer.dto';

export class Answer {
  id: number;                   // Идентификатор
  questionFormId: number;       // Идентификатор формы
  companyId: number;            // Идентификатор компании
  content: string;              // Содержание
  index: number;                // Порядковый номер
  next?: any;                   // ???
  weight: number;

  /**
   * Конструктор
   * @param {IAnswerDTO} config - Параметры инициализации
   */
  constructor(config?: IAnswerDTO) {
    this.id = config ? config.id : 0;
    this.questionFormId = config ? config.question_form_id : 0;
    this.companyId = config ? config.company_id : 0;
    this.content = config ? config.text_content : '';
    this.index = config ? config.index : 0;
    this.next = config ? config.next_questions_map_node : null;
    this.weight = config ? config.weight : null;
  }
}
