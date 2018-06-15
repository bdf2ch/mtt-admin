/**
 * Интерфейс, описывающий вознаграждение
 */
export interface IReward {
  id: number;             // Идентификатор
  companyId: number;      // Идентификатор компании
  title: string;          // Наименование
  description?: string;   // Описание
  start: Date;            // Дата начала действия
  end: Date;              // Дата окончания действия
  type: string;           // Тип вознаграждения
  value: any;             // Величина вознаграждения
}
