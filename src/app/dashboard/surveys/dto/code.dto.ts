/**
 * Survey code DTO interface
 */
export interface ICodeDTO {
  company_id: number;             // Идентификатор компании
  questionnaire_id: number;       // Идентификатор опроса
  value: string;                  // Код
  is_used: boolean;               // Был ли код использован
}
