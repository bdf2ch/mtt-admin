import { IQuestionFormDTO } from './question-form.dto';
import { IAnswerDTO } from './answer.dto';
import { IRangeDTO } from './range.dto';

/**
 * Question DTO interface
 */
export interface IQuestionDTO {
  id?: number;                        // Идентификатор
  company_id?: number;                // Идентификатор компании
  type: string;                       // Тип вопроса
  title: string;                      // Текст вопроса
  weight: number;                     // Вес вопроса
  form?: {                            // Форма вопроса
    data: IQuestionFormDTO
  };
  answers?: {                         // Ответы
    data: IAnswerDTO[]
  };
  range?: {                           // Диапазон
    data: IRangeDTO
  };
}
