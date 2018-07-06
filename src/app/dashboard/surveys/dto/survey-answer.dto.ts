import { IQuestionDTO } from './question.dto';

export interface ISurveyAnswerDTO {
  question_id: number;
  questionnaire_result_id: number;
  form_answer_id: number;
  client_id: string;
  question_form_range_id: number | null;
  value: string;
  question: {
    data: IQuestionDTO;
  };
}
