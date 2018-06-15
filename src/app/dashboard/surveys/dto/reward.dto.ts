/**
 * Reward DTO interface
 */
export interface IRewardDTO {
  id: number;                   // Идентификатор
  company_id: number;           // Идентфиикатор компании
  name: string;                 // Наименование
  description: string;          // Описание
  from: string;                 // Дата начала действия
  to: string;                   // Дата окончания действия
  type: string;                 // Тип
  value: any;                   // Величина
  is_available: boolean;        // Доступность
}
