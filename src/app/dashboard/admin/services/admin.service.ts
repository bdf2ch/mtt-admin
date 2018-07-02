import { Injectable } from '@angular/core';
import { AdminResource } from '../resources/admin.resource';
import { Company } from '../../company/models/company.model';
import { ICompanyDTO } from '../../company/dto/company.dto';
import { User } from '../../users/models/user.model';
import {IUserDTO} from '../../users/dto/user.dto';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private isSettingUserStatusInProgress: boolean;
  private companies: Company[];
  private users: User[];

  constructor(private readonly resource: AdminResource) {
    this.isSettingUserStatusInProgress = false;
    this.companies = [];
    this.users = [];
  }

  /**
   * Получение списка компаний с сервера
   * @returns {Promise<Company[]>}
   */
  async fetchCompanies(): Promise<Company[]> {
    try {
      const result = await this.resource.getCompanyList();
      if (result.data) {
        result.data.forEach((item: ICompanyDTO) => {
          const company = new Company(item);
          this.companies.push(company);
          item.personal.data.forEach((usr: IUserDTO) => {
            const user = new User(usr);
            user.company = company;
            this.users.push(user);
          });
        });
        console.log(this.users);
        console.log(this.companies);
        return this.companies;
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Активация / деактивация пользователя
   * @param {number} userId - Идентификатор пользователя
   * @param {boolean} isActive - Флаг активности
   * @returns {Promise<boolean>}
   */
  async setUserStatus(userId: number, isActive: boolean): Promise<boolean> {
    try {
      this.isSettingUserStatusInProgress = true;
      const result = await this.resource.setUserStatus({target_user_id: userId, status: isActive ? 1 : 0 });
      if (result.meta['success'] && result.meta['success'] === true) {
        this.isSettingUserStatusInProgress = false;
        const findUserById = (item: User) => item.id === userId;
        const user = this.users.find(findUserById);
        if (user) {
          user.isActive = isActive;
        }
      }
    } catch (error) {
      console.error(error);
      this.isSettingUserStatusInProgress = false;
      return null;
    }
  }

  /**
   * Получение списка всех компаний
   * @returns {Company[]}
   */
  getCompanies(): Company[] {
    return this.companies;
  }

  /**
   * Полученеи списка пользователенй
   * @returns {User[]}
   */
  getUsers(): User[] {
    return this.users;
  }

  /**
   * Выполняется ли изменение статуса пользователя
   * @returns {boolean}
   */
  settingUserStatusInProgress(): boolean {
    return this.isSettingUserStatusInProgress;
  }
}
