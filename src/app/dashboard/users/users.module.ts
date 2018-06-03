import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ElModule } from 'element-angular/release/element-angular.module';
import { UserListComponent } from './components/user-list/user-list.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { UserListGuard } from './guards/user-list.guard';
import { RolesListComponent } from './components/roles-list/roles-list.component';
import { UsersComponent } from './components/users/users.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ElModule
  ],
  declarations: [
    UserListComponent,
    AddUserComponent,
    RolesListComponent,
    UsersComponent
  ],
  providers: [
    UserListGuard
  ]
})
export class UsersModule {}
