import { Injectable } from '@angular/core';
import { IResourceMethod, Resource, ResourceAction, ResourceHandler, ResourceParams, ResourceRequestMethod } from '@ngx-resource/core';
import { environment } from '../../../../environments/environment';
import { IUserDTO } from '../dto/user.dto';
import { IServerResponse } from '../../../shared/interfaces/server-response.interface';

@Injectable({
  providedIn: 'root'
})
@ResourceParams({
  pathPrefix: environment.apiUrl,
  headers: {
    'Authorization': window.localStorage && window.localStorage['api_token'] ? `Bearer ${window.localStorage['api_token']}` : ''
  }
})
export class UsersResource extends Resource {

  constructor(handler: ResourceHandler) {
    super(handler);
  }

  /**
   * path: company/{!id}/user
   * Method: GET
   */
  @ResourceAction({
    path: 'company/{!companyId}/user',
    method: ResourceRequestMethod.Get,
    withCredentials: true
  })
  getUsersByCompanyId: IResourceMethod<{companyId: number}, IServerResponse<IUserDTO[]>>;
}
