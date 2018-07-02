import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { User } from '../../../users/models/user.model';
import { ElMessageService } from 'element-angular/release/message/message.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  public searchOnlyOwners: boolean;
  public search: string;

  constructor(public readonly adminService: AdminService,
              private readonly message: ElMessageService) {
    this.searchOnlyOwners = false;
    this.search = '';
  }

  ngOnInit() {}

  /**
   * Включение / отключение пользователя
   * @param {User} user - Пользователь
   * @returns {Promise<void>}
   */
  async setUserStatus(user: User) {
    await this.adminService.setUserStatus(user.id, !user.isActive)
      .then(() => {
        this.message['success']('Пользователь ' + (user.isActive ? 'отключен' : 'включен'));
      });
  }

  /**
   * Изменение параметра поиска только по владельцам
   * @param {boolean} value
   */
  changeSearchOnlyOwners(value: boolean) {
    this.searchOnlyOwners = value;
  }
}
