import { IQuestionFormDTO } from '../dto/question-form.dto';
import { QuestionFormType } from './question-form-type.model';

/**
 *
 */
export class QuestionForm {
  id: number;                   // Идентификатор
  questionId: number;           // Идентификатор вопроса
  companyId: number;            // Идентфиикатор компании
  type: string;                 // Тип формы вопроса

  constructor(config?: IQuestionFormDTO) {
    this.id = config ? config.id : 0;
    this.questionId = config ? config.question_id : 0;
    this.companyId = config ? config.company_id : 0;
    this.type = config ? config.type : '';
  }
}
