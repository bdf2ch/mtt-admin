import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Role } from '../../models/role.model';
import { IRoleDTO } from '../../dto/role.dto';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { Permission } from '../../models/permission.model';
import { ElMessageService } from 'element-angular/release/message/message.service';

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss']
})
export class RolesListComponent implements OnInit {
  isInAddRoleMode:  boolean;
  isInEditRoleMode: boolean;
  isInDeleteRoleMode: boolean;
  selectedRole: Role | null;
  userRoleForm: FormGroup;
  userRoleData: IRoleDTO;

  constructor(private readonly builder: FormBuilder,
              public readonly authenticationService: AuthenticationService,
              public readonly usersService: UsersService,
              private readonly message: ElMessageService) {
    this.isInAddRoleMode = false;
    this.isInEditRoleMode = false;
    this.isInDeleteRoleMode = false;
    this.selectedRole = null;
    this.userRoleData = {
      id: 0,
      name: '',
      display_name: '',
      description: ''
    };
  }

  ngOnInit() {
    this.userRoleForm = this.builder.group({
      name: ['', Validators.required],
      display_name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  /**
   * Открытие диалогового окна добавления роли пользователя
   */
  openAddRoleDialog() {
    this.userRoleData = {
      id: 0,
      name: '',
      display_name: '',
      description: ''
    };
    this.userRoleForm.reset({
      name: this.userRoleData.name,
      display_name: this.userRoleData.display_name,
      description: this.userRoleData.description
    });
    this.usersService.getPermissionList().forEach((permission: Permission) => {
      permission.isEnabled = false;
    });
    console.log(this.usersService.getPermissionList());
    this.isInAddRoleMode = true;
  }

  /**
   * Закрытие диалогового окна добавления роли пользователя
   */
  closeAddRoleDialog() {
    this.isInAddRoleMode = false;
  }

  /**
   * Открытите диалогвого окна изменения роли пользователя
   * @param {Role} role
   */
  openEditRoleDialog(role: Role) {
    this.selectedRole = role;
    this.userRoleData = {
      id: role.id,
      name: role.code,
      display_name: role.title,
      description: role.description
    };
    this.userRoleForm.reset({
      name: this.userRoleData.name,
      display_name: this.userRoleData.display_name,
      description: this.userRoleData.description
    });
    this.usersService.getPermissionList().forEach((item: Permission) => {
      const findPermissionById = (perm: Permission) => perm.id === item.id;
      const permission = this.selectedRole.permissions.find(findPermissionById);
      item.isEnabled = permission ? true : false;
    });
    this.isInEditRoleMode = true;
  }

  /**
   * Закрытие диалогового окна изменения роли пользователя
   */
  closeEditRoleDialog() {
    this.isInEditRoleMode = false;
    this.selectedRole = null;
  }

  /**
   * Открытие диалогового окна подтверждения удаления роли пользователя
   * @param {Role} role
   */
  openDeleteRoleDialog(role: Role) {
    this.selectedRole = role;
    this.isInDeleteRoleMode = true;
  }

  /**
   * Закрытие диалогового окна подтверждения удаления роли пользователя
   */
  closeDeleteRoleDialog() {
    this.isInDeleteRoleMode = false;
    this.selectedRole = null;
  }

  /**
   * Получение статуса элемента формы роли пользователя
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  userRoleFormStatusCtrl(item: string): string {
    if (!this.userRoleForm.controls[item]) { return; }
    const control: AbstractControl = this.userRoleForm.controls[item];
    return control.dirty && control.hasError('required') || control.hasError('pattern') ? 'error' : 'validating';
  }

  /**
   * Получение сообщения об ошибке элемента формы роли пользователя
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  userRoleFormMessageCtrl(item: string): string {
    if (!this.userRoleForm.controls[item]) { return; }
    const control: AbstractControl = this.userRoleForm.controls[item];
    switch (item) {
      case 'name':
        return control.dirty && control.hasError('required') ? 'Вы не указали код роли' : '';
      case 'display_name':
        return control.dirty && control.hasError('required') ? 'Вы не указали наименование роли' : '';
      case 'description':
        return control.dirty && control.hasError('required') ? 'Вы не указали описание роли' : '';
    }
  }

  /**
   * Изменение статуса права пользователя формы добавления роли пользователя
   * @param event
   */
  changePermissionStatus(event: any) {
    this.userRoleForm.markAsDirty();
  }

  /**
   * Добавление роли пользователя
   * @returns {Promise<void>}
   */
  async addUserRole() {
    await this.usersService.addUserRole(this.userRoleData, this.authenticationService.getCurrentUser().companyId)
      .then(async (role: Role) => {
        console.log(role);
        const permissionIds = [];
        this.usersService.getPermissionList().forEach((item: Permission) => {
          if (item.isEnabled) {
            permissionIds.push(item.id);
          }
        });
        console.log(permissionIds);
        await this.usersService.addPermissions(permissionIds, role.id);
        this.closeAddRoleDialog();
        this.message['success']('Роль пользователя добавлена');
      });
  }

  /**
   * Изменение роли пользователя
   * @returns {Promise<void>}
   */
  async editUserRole() {
    await this.usersService.editUserRole(this.userRoleData, this.authenticationService.getCurrentUser().companyId)
      .then(() => {
        this.closeEditRoleDialog();
        this.message['success']('Роль пользователя изменена');
      });
  }

  /**
   * Удаление роли порльзователя
   * @returns {Promise<void>}
   */
  async deleteUserRole() {
    await this.usersService.deleteUserRole(this.authenticationService.getCurrentUser().companyId, this.selectedRole.id)
      .then(() => {
        this.closeDeleteRoleDialog();
        this.message['success']('Роль пользователя удалена');
      });
  }
}
