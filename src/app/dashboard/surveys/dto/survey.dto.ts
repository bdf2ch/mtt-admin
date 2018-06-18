/**
 * Survey DTO interface
 */
export interface ISurveyDTO {
  id?: number;                        // Идентификатор
  company_id?: number;                // Идентификатор компании
  reward_id?: number;                 // Идентификатор вознаграждения
  name: string;                       // Наименование
  description?: string;               // Описание
  from?: string;                      // Дата начала
  to?: string | null;                 // Дата окончания
  available_passing_count?: number;   // Число возможных прохрождений
  passed_count?: number;              // Число завершенных прохождений
  is_template?: boolean;              // Является ли шаблоном
  is_active?: boolean;                // Является ли активным
  restaurants_ids?: number[];         // Массив идентфиикаторов ресторанов
}
