/**
 * Restaurant DTO interface
 */
export interface IRestaurantDTO {
  id: number;               // Идентификатор
  company_id: number;       // Идентификатор компании
  name: string;             // Наименование
  phone: string;            // Телефон
  site: string;             // Сайт
  r_keeper_config?: any;    // Конфигурация R-Keeper
}
