import { IUser } from './user.interface';
import { ICompany } from '../../companies/interfaces/company.interface';

/**
 * Интферфейс, описывающий клиента
 */
export interface IClient extends IUser {
  company: ICompany;  // Компания
}
