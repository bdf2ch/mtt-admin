import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { AuthenticationService } from '../../../authentication/services/authentication.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  addUserMode: boolean;

  constructor(private readonly authenticationService: AuthenticationService,
              public readonly usersService: UsersService) {
    this.addUserMode = false;
  }

  async ngOnInit() {}

  /**
   * Открфтие модальное окно добавления новго пользователя
   */
  openAddUserDialog() {
    this.addUserMode = true;
  }

  /**
   * Закрытие модального окна добавления нового пользователя
   */
  closeAddUserDialog() {
    console.log('emit recieved');
    this.addUserMode = false;
  }

}
