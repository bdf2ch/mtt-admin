import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { ILogIn } from '../../interfaces/log-in.interface';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.less']
})
export class LogInComponent implements OnInit {
  loginData: ILogIn;
  loginForm: FormGroup;

  constructor(private readonly formBuilder: FormBuilder,
              private readonly authenticationService: AuthenticationService) {
    this.loginData = {
      email: null,
      password: null
    };
    this.loginForm = this.formBuilder.group( {
      email: [''],
      password: ['']
    });
  }

  ngOnInit() {}


  statusCtrl(item: string): string {
    if (!this.loginForm.controls[item]) { return; }
    const control: AbstractControl = this.loginForm.controls[item];
    return control.dirty && control.hasError('status') ? control.errors.status : '';
  }

  messageCtrl(item: string): string {
    if (!this.loginForm.controls[item]) { return; }
    const control: AbstractControl = this.loginForm.controls[item];
    return control.dirty && control.hasError('message') ? control.errors.message : '';
  }

  async submit() {
    console.log(this.loginForm);
    const result = await this.authenticationService.logIn(this.loginData);
  }

}
