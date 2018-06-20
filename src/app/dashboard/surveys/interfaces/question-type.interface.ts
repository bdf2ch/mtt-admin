/**
 * Интерфейс, описывающий тип вопроса
 */
import { IQuestionFormType } from './question-form-type.interface';

export interface IQuestionType {
  code: string;                   // Код типа
  title: string;                  // Наименование типа
  forms?: IQuestionFormType[];    // Доступные формы вопроса
}
