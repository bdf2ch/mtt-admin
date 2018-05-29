import { Injectable } from '@angular/core';
import { AuthenticationResource } from '../resources/authentication.resource';
import { IUser } from '../../users/interfaces/user.interface';
import { ILogIn } from '../interfaces/log-in.interface';
import { User } from '../../users/models/user.model';
import { IServerResponse } from '../../../shared/interfaces/server-response.interface';
import {IUserDTO} from '../../users/dto/user.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUser: User | null;
  private token: string;
  private isAuthenticationInProgress: boolean;

  constructor(private readonly resource: AuthenticationResource) {
    this.currentUser = null;
    this.isAuthenticationInProgress = false;
  }

  /**
   * Выполняется ли процесс авторизации
   * @returns {boolean}
   */
  isAuthenticating(): boolean {
    return this.isAuthenticationInProgress;
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
        const result: IServerResponse<IUserDTO> = await this.resource.check();
        this.currentUser = result.data ? new User(result.data) : null;
        console.log('current user', this.currentUser);
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
    this.isAuthenticationInProgress = true;
    try {
      const result: IServerResponse<IUserDTO> = await this.resource.logIn(loginData);
      this.isAuthenticationInProgress = false;
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
      this.isAuthenticationInProgress = false;
      return null;
    }
  }

  /**
   * Завершение текущей сессии
   * @returns {Promise<void>}
   */
  async logOut(): Promise<void> {
    try {
      if (window.localStorage && window.localStorage['api_token']) {
        window.localStorage.removeItem('api_token');
        this.currentUser = null;
      }
    } catch (error) {
      console.error(error);
    }
  }
}
