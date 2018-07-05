import { ICodeDTO } from '../dto/code.dto';

/**
 * Класс, реализующий модель кода прохождения опроса
 */
export class Code {
  companyId: number;             // Идентификатор компании
  surveyId: number;              // Идентификатор опроса
  value: string | null;          // Код
  isUsed: boolean;               // Был ли код использован

  /**
   * Конструктор
   * @param {ICodeDTO} config - Параметры инициализации
   */
  constructor(config?: ICodeDTO) {
    this.companyId = config ? config.company_id : 0;
    this.surveyId = config ? config.questionnaire_id : 0;
    this.value = config ? config.value : null;
    this. isUsed = config ? config.is_used : false;
  }
}
