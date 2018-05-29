import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  addUserMode: boolean;

  constructor(public readonly usersService: UsersService) {
    this.addUserMode = false;
  }

  ngOnInit() {}

  openAddUserDialog() {
    this.addUserMode = true;
  }

  closeAddUserDialog() {
    console.log('emit recieved');
    this.addUserMode = false;
  }

}
