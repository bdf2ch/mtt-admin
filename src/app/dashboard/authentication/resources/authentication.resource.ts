import { Injectable } from '@angular/core';
import { IResourceMethod, Resource, ResourceAction, ResourceHandler, ResourceParams, ResourceRequestMethod } from '@ngx-resource/core';
import { ILogIn } from '../interfaces/log-in.interface';
import { IUser } from '../../users/interfaces/user.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
@ResourceParams({
  pathPrefix: environment.apiUrl + 'auth/'
})
export class AuthenticationResource extends Resource {

  constructor(handler: ResourceHandler) {
    super(handler);
  }

  @ResourceAction({
    path: 'login',
    method: ResourceRequestMethod.Post,
    withCredentials: true
  })
  logIn: IResourceMethod<ILogIn, IUser>;
}
