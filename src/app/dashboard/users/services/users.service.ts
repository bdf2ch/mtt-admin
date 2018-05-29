import { Injectable } from '@angular/core';
import {User} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private users: User[];

  constructor(public readonly usersService: UsersService) {
    this.users = [];
    this.users.push(new User({
      id: 0,
      first_name: 'Иван',
      patronymic: 'Иванович',
      last_name: 'Иванов',
      email: 'ivanov@testmail.ru',
      phone: '55-66-77',
      position: 'Директор',
      //password: 'test',
      roles: []
    }));
  }

  /**
   * Возвращает список всех пользователей
   * @returns {User[]}
   */
  getUserList(): User[] {
    return this.users;
  }

}
