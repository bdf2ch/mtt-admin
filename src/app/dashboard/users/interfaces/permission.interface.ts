/**
 * Интерфейс, описывающий право пользователя
 */
export interface IPermission {
  id: number;               // Идентификатор
  code: string;             // Код права пользователя
  title: string;            // Наименование
  description: string;      // Описание
}
