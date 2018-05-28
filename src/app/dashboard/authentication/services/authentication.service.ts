import { Injectable } from '@angular/core';
import { AuthenticationResource } from '../resources/authentication.resource';
import { IUser } from '../../users/interfaces/user.interface';
import { ILogIn } from '../interfaces/log-in.interface';
import { User } from '../../users/models/user.model';
import { IServerResponse } from '../../../shared/interfaces/server-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUser: User | null;
  private token: string;

  constructor(private readonly resource: AuthenticationResource) {
    this.currentUser = null;
  }

  /**
   * Возвращает текущего пользователя
   * @returns {User | null}
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Проверка текщей сессии пользователя
   * @returns {Promise<User | null>}
   */
  async check(): Promise<User | null> {
    try {
      if (window.localStorage && window.localStorage['api_token']) {
        const result: IServerResponse<IUser> = await this.resource.check();
        this.currentUser = result.data ? new User(result.data) : null;
        return this.currentUser;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Авторизация пользователя
   * @param {ILogIn} loginData - данные для авторизации
   * @returns {Promise<User | null>}
   */
  async logIn(loginData: ILogIn): Promise<User | null> {
    try {
      const result: IServerResponse<IUser> = await this.resource.logIn(loginData);
      console.log(result);
      if (result.data) {
        this.currentUser = new User(result.data);
        this.token = result.meta['api_token'];
        if (window.localStorage) {
          window.localStorage.setItem('api_token', this.token);
        }
        return this.currentUser;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Завершение текущей сессии
   * @returns {Promise<void>}
   */
  async logout(): Promise<void> {
    try {
      await this.resource.logOut();
    } catch (error) {
      console.error(error);
    }
  }
}
