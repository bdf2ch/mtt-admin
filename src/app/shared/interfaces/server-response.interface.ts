/**
 * Интерфейс, описывающий ответ от сервера
 */
export interface IServerResponse<T> {
  data: T;          // Данные
  meta?: any;       // Дополнительная информация
}
