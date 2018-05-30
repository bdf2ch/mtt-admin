import { IUser } from './user.interface';
import { ICompany } from '../../company/interfaces/company.interface';

/**
 * Интферфейс, описывающий клиента
 */
export interface IClient extends IUser {
  company: ICompany;  // Компания
}
