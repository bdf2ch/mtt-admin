/**
 * TimeTable DTO interface
 */
export interface ITimeTableDTO {
  id: number;                       // Идентификатор
  from: string;                     // Время начала работы
  to?: string;                      // Время окончания работы
  until_last_client?: boolean;      // До последнего клиента
}
