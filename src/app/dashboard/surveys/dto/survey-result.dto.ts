import { ISurveyAnswerDTO } from './survey-answer.dto';

export interface ISurveyResultDTO {
    id: number;
    finished_at: string;
    status: string;
    reward_id: number;
    questionnaire_id: number;
    restaurant_id: number;
    client_id: string;
    reward_code_id: number;
    viewed: boolean;
    answers: {
      data: ISurveyAnswerDTO[];
    };
}
