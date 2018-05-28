import { Injectable } from '@angular/core';
import { IResourceMethod, Resource, ResourceAction, ResourceHandler, ResourceParams, ResourceRequestMethod } from '@ngx-resource/core';
import { ILogIn } from '../interfaces/log-in.interface';
import { IUser } from '../../users/interfaces/user.interface';
import { environment } from '../../../../environments/environment';
import { IServerResponse } from '../../../shared/interfaces/server-response.interface';

@Injectable({
  providedIn: 'root'
})
@ResourceParams({
  pathPrefix: environment.apiUrl + 'auth/',
  headers: {
    'Authorization': window.localStorage && window.localStorage['api_token'] ? `Bearer ${window.localStorage['api_token']}` : ''
  }
})
export class AuthenticationResource extends Resource {

  constructor(handler: ResourceHandler) {
    super(handler);
  }

  /**
   * Path: auth/me
   * Method: GET
   */
  @ResourceAction({
    path: 'me',
    method: ResourceRequestMethod.Get,
    withCredentials: true
  })
  check: IResourceMethod<void, IServerResponse<IUser>>;

  /**
   * Path: auth/login
   * Method: POST
   */
  @ResourceAction({
    path: 'login',
    method: ResourceRequestMethod.Post,
    withCredentials: true
  })
  logIn: IResourceMethod<ILogIn, IServerResponse<IUser>>;

  /**
   * Path: auth/logout
   * Method: POST
   */
  @ResourceAction({
    path: 'logout',
    method: ResourceRequestMethod.Post,
    withCredentials: true
  })
  logOut: IResourceMethod<void, IServerResponse<void>>;
}
