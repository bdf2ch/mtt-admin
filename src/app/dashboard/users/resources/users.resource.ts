import { Injectable } from '@angular/core';
import {
  IResourceMethod,
  IResourceMethodStrict,
  Resource,
  ResourceAction,
  ResourceHandler,
  ResourceParams,
  ResourceRequestMethod
} from "@ngx-resource/core";
import { environment } from '../../../../environments/environment';
import { IUserDTO } from '../dto/user.dto';
import { IServerResponse } from '../../../shared/interfaces/server-response.interface';
import { IRoleDTO } from '../dto/role.dto';
import {IPermissionDTO} from "../dto/permission.dto";

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
   * Path: company/{!companyId}/role
   * Method: GET
   */
  @ResourceAction({
    path: 'company/{!companyId}/role',
    method: ResourceRequestMethod.Get,
    withCredentials: true
  })
  getUserRolesByCompanyId: IResourceMethod<{companyId: number}, IServerResponse<IRoleDTO[]>>;

  /**
   * Path: company/{!companyId}/role
   * Method: POST
   */
  @ResourceAction({
    path: 'company/{!companyId}/role',
    method: ResourceRequestMethod.Post,
    withCredentials: true
  })
  addUserRole: IResourceMethodStrict<IRoleDTO, void, {companyId: number}, IServerResponse<IRoleDTO>>;

  /**
   * Path: permission
   * Method: GET
   */
  @ResourceAction({
    path: '/permission',
    method: ResourceRequestMethod.Get,
    withCredentials: true
  })
  getPermissions: IResourceMethod<void, IServerResponse<IPermissionDTO[]>>;

  /**
   * Path: company/{!companyId}/user
   * Method: GET
   */
  @ResourceAction({
    path: 'company/{!companyId}/user',
    method: ResourceRequestMethod.Get,
    withCredentials: true
  })
  getUsersByCompanyId: IResourceMethod<{companyId: number}, IServerResponse<IUserDTO[]>>;
}
