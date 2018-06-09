/**
 * User permission DTO interface
 */
export interface IPermissionDTO {
  id: number;               // Идентификатор
  name: string;             // Код права пользователя
  display_name: string;     // Наименование права пользователя
  description: string;      // Описание права пользователя
}
