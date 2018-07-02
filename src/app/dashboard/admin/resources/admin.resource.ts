import { Injectable } from '@angular/core';
import { IResourceMethod, Resource, ResourceAction, ResourceHandler, ResourceParams, ResourceRequestMethod } from '@ngx-resource/core';
import { environment } from '../../../../environments/environment';
import { IServerResponse } from '../../../shared/interfaces/server-response.interface';
import { ICompanyDTO } from '../../company/dto/company.dto';

@Injectable({
  providedIn: 'root'
})
@ResourceParams({
  pathPrefix: environment.apiUrl,
  withCredentials: true,
  headers: {
    'Authorization': window.localStorage && window.localStorage['api_token'] ? `Bearer ${window.localStorage['api_token']}` : ''
  }
})
export class AdminResource extends Resource {

  constructor(handler: ResourceHandler) {
    super(handler);
  }

  /**
   * Path: company
   * Method: GET
   */
  @ResourceAction({
    path: '/company',
    method: ResourceRequestMethod.Get
  })
  getCompanyList: IResourceMethod<void, IServerResponse<ICompanyDTO[]>>;

  /**
   * Path: user/set-active-status
   * Method: POST
   */
  @ResourceAction({
    path: '/user/set-active-status',
    method: ResourceRequestMethod.Post,
    withCredentials: true
  })
  setUserStatus: IResourceMethod<{target_user_id: number, status: number}, IServerResponse<any>>;

}
