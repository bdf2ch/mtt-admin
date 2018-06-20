import { IQuestionType } from '../interfaces/question-type.interface';
import { IQuestionFormType } from '../interfaces/question-form-type.interface';

/**
 * Класс, реализующий интефейс типа вопроса
 */
export class QuestionType implements IQuestionType {
  code: string;                 // Код типа
  title: string;                // Наименование
  forms: IQuestionFormType[];   // Доступные формы вопроса

  /**
   * Конструктор
   * @param {IQuestionType} config - Параметры инициализации
   */
  constructor(config?: IQuestionType) {
    this.code = config ? config.code : '';
    this.title = config ? config.title : '';
    this.forms = [];
  }
}
