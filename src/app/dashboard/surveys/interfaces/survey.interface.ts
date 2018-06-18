/**
 * Интерфейс, описывающий опрос
 */
export interface ISurvey {
  id: number;                     // Идентификатор
  companyId: number;              // Идентфиикатор компании
  rewardId: number;               // Идентификатор вознаграждения
  title: string;                  // Наименование
  description?: string | null;    // Описание
  start: Date | null;             // Дата начала
  end?: Date | null;              // Дата окончания
  passingCount: number;           // Число возможных прохождений
  passedCount: number;            // Число завершенных прохождений
  isTemplate: boolean;            // Является ли шаблоном
  isActive: boolean;              // Является ли активным
}
