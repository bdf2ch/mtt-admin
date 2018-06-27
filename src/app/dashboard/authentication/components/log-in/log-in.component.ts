import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ILogIn } from '../../interfaces/log-in.interface';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../../users/models/user.model';
import { ElMessageService } from 'element-angular/release/message/message.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {
  loginData: ILogIn;
  loginForm: FormGroup;

  constructor(private readonly router: Router,
              private readonly formBuilder: FormBuilder,
              public readonly authenticationService: AuthenticationService,
              private message: ElMessageService) {
    this.loginData = {
      email: null,
      password: null
    };
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group( {
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


  statusCtrl(item: string): string {
    if (!this.loginForm.controls[item]) { return; }
    const control: AbstractControl = this.loginForm.controls[item];
    return control.dirty && control.hasError('required') ? 'error' : control.pristine && control.hasError('required') ? 'validating' : 'success';
  }

  messageCtrl(item: string): string {
    if (!this.loginForm.controls[item]) { return; }
    const control: AbstractControl = this.loginForm.controls[item];
    let result: string | null = null;
    switch (item) {
      case 'email':
        result = control.dirty && control.hasError('required') ? 'Введите Ваш e-mail' : null;
        break;
      case 'password':
        result = control.dirty && control.hasError('required') ? 'Введите пароль' : null;
        break;
    }
    return result;
  }

  async submit() {
    console.log(this.loginForm);
    const result: User | null = await this.authenticationService.logIn(this.loginData);
    if (result) {
      // this.router.navigate(['/']).then(() => {
        window.location.reload();
      // });
    } else {
      this.message.setOptions({ showClose: true });
      this.message['warning']('Пользователь не найден');
    }
  }

}
