/**
 * Интерфейс, описывающий время работы ресторана
 */
export interface ITimeTable {
  id: number;                 // Идентификатор
  opening: string;            // Открытие
  closing: string;            // Закрытие
  untilLastClient: boolean;   // Работа до последнего клиента
}
