/**
 * Интерфейс, описывающий роль пользователя
 */
export interface IRole {
  id: number;             // Идентфиикатор роли
  companyId?: number;     // Идентфикатор компании
  title: string;          // Наименование
}
