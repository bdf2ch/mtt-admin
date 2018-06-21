/**
 * Range DTO interface
 */
export interface IRangeDTO {
  id?: number;                  // Идентификатор
  question_id?: number;         // Идентификатор вопроса
  question_form_id?: number;    // Идентфиикатор формы
  company_id?: number;          // Идентфиикатор компании
  min: number;                  // Минимальное значение
  max: number;                  // Максимальноке значение
}
