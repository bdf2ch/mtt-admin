import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { UsersResource } from '../resources/users.resource';
import {IUserDTO} from '../dto/user.dto';
import {IServerResponse} from '../../../shared/interfaces/server-response.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private users: User[];

  constructor(private readonly resource: UsersResource) {
    this.users = [];
  }

  /**
   * Возвращает список всех пользователей
   * @returns {User[]}
   */
  getUserList(): User[] {
    return this.users;
  }

  /**
   * Получение списка пользователей по идентификатору компании
   * @param {number} companyId - Идентификатор компании
   * @returns {Promise<User[]>}
   */
  async fetchUsersByCompanyId(companyId: number): Promise<User[]> {
    try {
      const result: IServerResponse<IUserDTO[]> = await this.resource.getUsersByCompanyId({companyId: companyId});
      if (result.data) {
        this.users = [];
        result.data.forEach((item: IUserDTO) => {
          const user = new User(item);
          this.users.push(user);
        });
      }
      return this.users;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

}
