import { QuestionType } from './question-type.model';
import { QuestionForm } from './question-form.model';
import { Answer } from './answer.model';
import { IQuestionDTO } from '../dto/question.dto';
import { IAnswerDTO } from '../dto/answer.dto';
import { QuestionRange } from './question-range.model';

export class Question {
  id: number;                       // Идентфиикатор
  companyId: number;                // Идентфиикатор компании
  type: string;                     // Тип вопроса
  title: string;                    // Текст вопроса
  weight: number;                   // Вес вопроса
  form: QuestionForm;               // Форма
  answers: Answer[];                // Ответы
  range: QuestionRange | null;      // Диапазон

  /**
   * Конструктор
   * @param {IQuestionDTO} config - Параметры инициализации
   */
  constructor(config?: IQuestionDTO) {
    this.id = config ? config.id : 0;
    this.companyId = config ? config.company_id : 0;
    this.type = config.type;
    this.title = config ? config.title : '';
    this.weight = config ? config.weight : 0;
    this.form = config ? new QuestionForm(config.form.data) : null;
    this.range = config && config.range ? new QuestionRange(config.range.data) : null;
    this.answers = [];

    if (config && config.answers) {
      config.answers.data.forEach((item: IAnswerDTO) => {
        const answer = new Answer(item);
        this.answers.push(answer);
      });
    }
  }
}
