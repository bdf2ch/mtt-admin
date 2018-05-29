/**
 * User Data transfer object interface
 */
export interface IUserDTO {
  id: number;             // Идентификатор
  //company_id: number;     // Идентификатор компании
  first_name: string;     // Имя
  patronymic: string;     // Отчество
  last_name: string;      // Фамилия
  position: string;       // Должность
  email: string;          // E-mail
  phone: string;          // Телефон
  roles: any[];           // Роли пользователя
}
