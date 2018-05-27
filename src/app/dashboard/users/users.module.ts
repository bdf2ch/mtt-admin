import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './components/user-list/user-list.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { ElModule } from 'element-angular/release/element-angular.module';

@NgModule({
  imports: [
    CommonModule,
    ElModule
  ],
  declarations: [
    UserListComponent,
    AddUserComponent
  ]
})
export class UsersModule {}
