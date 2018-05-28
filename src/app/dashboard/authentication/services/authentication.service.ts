import { Injectable } from '@angular/core';
import { AuthenticationResource } from '../resources/authentication.resource';
import { IUser } from '../../users/interfaces/user.interface';
import { ILogIn } from '../interfaces/log-in.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private readonly resource: AuthenticationResource) {}

  async logIn(loginData: ILogIn): Promise<IUser | null> {
    console.log('data', loginData);
    try {
      const result = await this.resource.logIn(loginData);
      console.log(result);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
