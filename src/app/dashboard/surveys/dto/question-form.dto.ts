/**
 * Question form DTO interface
 */
export interface IQuestionFormDTO {
  id?: number;              // Идентификатор
  question_id: number;      // Идентфиикатор вопроса
  company_id?: number;      // Идентификатор компании
  type: string;             // Тип
}
