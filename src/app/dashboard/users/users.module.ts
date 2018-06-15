import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ElModule } from 'element-angular/release/element-angular.module';
import { UserListComponent } from './components/user-list/user-list.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { UserListGuard } from './guards/user-list.guard';
import { RolesListComponent } from './components/roles-list/roles-list.component';
import { UsersComponent } from './components/users/users.component';
import { RoleListGuard } from './guards/role-list.guard';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ElModule
  ],
  declarations: [
    UserListComponent,
    AddUserComponent,
    RolesListComponent,
    UsersComponent
  ],
  providers: [
    RoleListGuard,
    UserListGuard
  ]
})
export class UsersModule {}
