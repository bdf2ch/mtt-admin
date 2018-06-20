import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import {FormBuilder, FormGroup, AbstractControl, Validators, FormControl} from '@angular/forms';
import { IUserDTO } from '../../dto/user.dto';
import { User } from '../../models/user.model';
import { ElMessageService } from 'element-angular/release/message/message.service';
import { Role } from '../../models/role.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  isInAddUserMode: boolean;
  isInEditUserMode: boolean;
  isInDeleteUserMode: boolean;
  selectedUser: User | null;
  userForm: FormGroup;
  userData: IUserDTO;
  confirmPassword: string;

  constructor(private readonly builder: FormBuilder,
              private readonly authenticationService: AuthenticationService,
              public readonly usersService: UsersService,
              private readonly message: ElMessageService) {
    this.isInAddUserMode = false;
    this.isInEditUserMode = false;
    this.isInDeleteUserMode = false;
    this.selectedUser = null;
    this.userData = {
      id: 0,
      company_id: this.authenticationService.getCurrentUser().companyId,
      first_name: '',
      patronymic: '',
      last_name: '',
      email: '',
      phone: '',
      password: ''
    };
    this.confirmPassword = '';
  }

  async ngOnInit() {
    this.userForm = this.builder.group({
      first_name: [this.userData.first_name, Validators.required],
      patronymic: [this.userData.patronymic, Validators.required],
      last_name: [this.userData.last_name, Validators.required],
      email: [this.userData.email, [Validators.required, Validators.email]],
      phone: [this.userData.email, Validators.required]
      // password: [this.userData.password, Validators.required],
      // confirm_password: [this.confirmPassword, Validators.required]
    });
  }

  /**
   * Получение статуса элемента формы пользователя
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  userFormStatusCtrl(item: string): string {
    if (!this.userForm.controls[item]) { return; }
    const control: AbstractControl = this.userForm.controls[item];
    switch (item) {
      case 'confirm_password':
        const password = this.userForm.get('password');
        return control.dirty && control.hasError('required')
          ? 'error' : password.value !== control.value && control.value !== ''
            ? 'error' : 'validating';
      default:
        return control.dirty && control.hasError('required') || control.hasError('email') ? 'error' : 'validating';
    }}

  /**
   * Получение сообщения об ошибке элемента формы пользователя
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  userFormMessageCtrl(item: string): string {
    if (!this.userForm.controls[item]) { return; }
    const control: AbstractControl = this.userForm.controls[item];
    switch (item) {
      case 'first_name':
        return control.dirty && control.hasError('required') ? 'Вы не указали имя' : '';
      case 'patronymic':
        return control.dirty && control.hasError('required') ? 'Вы не указали отчество' : '';
      case 'last_name':
        return control.dirty && control.hasError('required') ? 'Вы не указали фамилию' : '';
      case 'email':
        return control.dirty && control.hasError('required')
          ? 'Вы не указали E-mail' : control.hasError('email')
            ? 'E-mail задан некорректно' : '';
      case 'phone':
        return control.dirty && control.hasError('required') ? 'Вы не указали телефон' : '';
      case 'password':
        return control.dirty && control.hasError('required') ? 'Вы не указали пароль' : '';
      case 'confirm_password':
        const password = this.userForm.get('password');
        return control.dirty && control.hasError('required')
          ? 'Вы не указали пароль еще раз' : password.value !== control.value && password.dirty && control.value !== ''
            ? 'Пароли не совпадают' : '';
    }
  }

  /**
   * Изменение статуса роли пользователя
   * @param {boolean} value
   */
  changeRoleStatus(value: boolean) {
    this.userForm.markAsDirty();
  }

  /**
   * Открытие модальное окно добавления новго пользователя
   */
  openAddUserDialog() {
    this.isInAddUserMode = true;
    this.userData = {
      id: 0,
      company_id: this.authenticationService.getCurrentUser().companyId,
      first_name: '',
      patronymic: '',
      last_name: '',
      email: '',
      phone: '',
      password: ''
    };
    this.confirmPassword = '';
    this.userForm.addControl('password', new FormControl(Validators.required));
    this.userForm.addControl('confirm_password', new FormControl(Validators.required));
    this.userForm.reset({
      first_name: this.userData.first_name,
      patronymic: this.userData.patronymic,
      last_name: this.userData.last_name,
      email: this.userData.email,
      phone: this.userData.phone,
      password: this.userData.password,
      confirm_password: this.confirmPassword
    });
    this.usersService.getRoleList().forEach((role: Role) => {
      role.isEnabled = false;
    });
  }

  /**
   * Закрытие модального окна добавления нового пользователя
   */
  closeAddUserDialog() {
    this.isInAddUserMode = false;
  }

  /**
   * Открытие диалогового окна изменения пользователя
   * @param {User} user - пользователь
   */
  openEditUserDialog(user: User) {
    this.selectedUser = user;
    this.userData.id = user.id;
    this.userData.company_id = user.companyId;
    this.userData.first_name = user.firstName;
    this.userData.patronymic = user.secondName;
    this.userData.last_name = user.lastName;
    this.userData.email = user.email;
    this.userData.phone = user.phone;
    this.userForm.removeControl('password');
    this.userForm.removeControl('confirm_password');
    this.userForm.reset({
      first_name: this.userData.first_name,
      patronymic: this.userData.patronymic,
      last_name: this.userData.last_name,
      email: this.userData.email,
      phone: this.userData.phone
    });
    user.roles.forEach((role: Role) => {
      this.usersService.getRoleList().forEach((item: Role) => {
        if (item.id === role.id) {
          console.log('role', item);
          item.isEnabled = true;
        }
      });
    });
    this.isInEditUserMode = true;
  }

  /**
   * Закрытие диалогового окна изменения пользователя
   */
  closeEditUserDialog() {
    this.selectedUser = null;
    this.isInEditUserMode = false;
    this.usersService.getRoleList().forEach((role: Role) => {
      role.isEnabled = false;
    });
  }

  /**
   * Открытие диалогового окна подтверждения удаления пользователя
   * @param {User} user - Пользователь
   */
  openDeleteUserDialog(user: User) {
    this.selectedUser = user;
    this.isInDeleteUserMode = true;
  }

  /**
   * Закрытие диалогового окна подтверждения удаления пользователя
   */
  closeDeleteUserDialog() {
    this.selectedUser = null;
    this.isInDeleteUserMode = false;
  }

  /**
   * Добавление пользователя
   * @returns {Promise<void>}
   */
  async addUser() {
    const rolesIds = [];
    this.usersService.getRoleList().forEach((item: Role) => {
      if (item.isEnabled) {
        rolesIds.push(item.id);
      }
    });
    if (rolesIds.length > 0) {
      this.userData.roles_ids = rolesIds;
    }
    await this.usersService.addUser(this.userData, this.authenticationService.getCurrentUser().companyId)
      .then((user: User) => {
        this.closeAddUserDialog();
        this.message['success']('Пользователь добавлен');
      });
  }

  /**
   * Изменение пользователя
   * @returns {Promise<void>}
   */
  async editUser() {
    const rolesIds = [];
    this.usersService.getRoleList().forEach((item: Role) => {
      if (item.isEnabled) {
        rolesIds.push(item.id);
      }
    });
    if (rolesIds.length > 0) {
      this.userData.roles_ids = rolesIds;
    }
    await this.usersService.editUser(this.userData, this.authenticationService.getCurrentUser().companyId)
      .then(() => {
        this.closeEditUserDialog();
        this.message['success']('Пользователь изменен');
      });
  }

  /**
   * Удаление пользователя
   */
  async deleteUser() {
    await this.usersService.deleteUser(this.authenticationService.getCurrentUser().companyId, this.selectedUser.id)
      .then(() => {
        this.closeDeleteUserDialog();
        this.message['success']('Пользователь удален');
      });
  }

}
