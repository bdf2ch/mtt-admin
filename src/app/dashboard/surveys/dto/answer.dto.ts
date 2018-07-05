/**
 * Answer DTO interface
 */
export interface IAnswerDTO {
  id?: number;                            // Идентификатор
  question_form_id?: number;              // Идентфиикатор формы
  company_id?: number;                    // Идентификатор компании
  text_content: string;                   // Текст ответа
  index?: number;                         // Прядковый номер
  weight?: number;                        // Вес отаета
  next_questions_map_node?: any | null;   // ХЗ что это
  dateCreated?: number;                   // Дата создания
  statistic?: {                           // Статистика ответа
    data: {
      value: number;
      type: string;
    };
  };
}
