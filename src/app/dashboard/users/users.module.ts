import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElModule } from 'element-angular/release/element-angular.module';
import { UserListComponent } from './components/user-list/user-list.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { UserListGuard } from './guards/user-list.guard';

@NgModule({
  imports: [
    CommonModule,
    ElModule
  ],
  declarations: [
    UserListComponent,
    AddUserComponent
  ],
  providers: [
    UserListGuard
  ]
})
export class UsersModule {}
