import { IQuestionFormType } from '../interfaces/question-form-type.interface';

/**
 * Класс, реализующий интерфейс формы вопроса
 */
export class QuestionFormType {
  code: string;         // Код формы
  title: string;        // Наименование

  /**
   * Конструктор
   * @param {IQuestionForm} config - Параметры инициализации
   */
  constructor(config?: IQuestionFormType) {
    this.code = config ? config.code : '';
    this.title = config ? config.title : '';
  }
}
