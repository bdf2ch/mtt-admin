import { Injectable } from '@angular/core';
import {
  IResourceMethod,
  IResourceMethodStrict,
  Resource,
  ResourceAction,
  ResourceHandler,
  ResourceParams,
  ResourceRequestMethod
} from '@ngx-resource/core';
import { environment } from '../../../../environments/environment';
import { IUserDTO } from '../dto/user.dto';
import { IServerResponse } from '../../../shared/interfaces/server-response.interface';
import { IRoleDTO } from '../dto/role.dto';
import { IPermissionDTO } from '../dto/permission.dto';

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
   * Path: company/{!companyId}/role/{!roleId}
   * Method: PATCH
   */
  @ResourceAction({
    path: 'company/{!companyId}/role/{!roleId}',
    method: ResourceRequestMethod.Patch,
    withCredentials: true
  })
  editUserRole: IResourceMethodStrict<IRoleDTO, void, {companyId: number, roleId: number}, IServerResponse<IRoleDTO>>;

  /**
   * Path: company/{!companyId}/role/{!roleId}
   * Method: DELETE
   */
  @ResourceAction({
    path: '/company/{!companyId}/role/{!roleId}',
    method: ResourceRequestMethod.Delete,
    withCredentials: true
  })
  deleteUserRole: IResourceMethod<{companyId: number, roleId: number}, IServerResponse<boolean>>;

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
   * Path: role/{!roleId}/attach-permission
   * Method: PATCH
   */
  @ResourceAction({
    path: '/role/{!roleId}/attach-permissions',
    method: ResourceRequestMethod.Patch,
    withCredentials: true
  })
  addPermissions: IResourceMethodStrict<{permissions_ids: number[]}, void, {roleId: number}, IServerResponse<IRoleDTO>>;

  /**
   * Path: role/{!roleId}/detach-permissions
   * Method: PATCH
   */
  @ResourceAction({
    path: '/role/{!roleId}/detach-permissions',
    method: ResourceRequestMethod.Patch,
    withCredentials: true
  })
  deletePermissions: IResourceMethodStrict<{permissions_ids: number[]}, void, {roleId: number}, IServerResponse<IRoleDTO>>;

  /**
   * Path: company/{!companyId}/user
   * Method: GET
   */
  @ResourceAction({
    path: '/company/{!companyId}/user',
    method: ResourceRequestMethod.Get,
    withCredentials: true
  })
  getUsersByCompanyId: IResourceMethod<{companyId: number}, IServerResponse<IUserDTO[]>>;

  /**
   * Path: company/{!companyId}/user
   * Method: POST
   */
  @ResourceAction({
    path: '/company/{!companyId}/user',
    method: ResourceRequestMethod.Post,
    withCredentials: true
  })
  addUser: IResourceMethodStrict<IUserDTO, void, {companyId: number}, IServerResponse<IUserDTO>>;

  /**
   * Path: company/{!companyId}/user/{!userId}
   * Method: PATCH
   */
  @ResourceAction({
    path: '/company/{!companyId}/user/{!userId}',
    method: ResourceRequestMethod.Patch,
    withCredentials: true
  })
  editUser: IResourceMethodStrict<IUserDTO, void, {companyId: number, userId: number}, IServerResponse<IUserDTO>>;

  /**
   * Path: company/{!companyId}/user/{!userId}
   * Method: DELETE
   */
  @ResourceAction({
    path: '/company/{!companyId}/user/{!userId}',
    method: ResourceRequestMethod.Delete,
    withCredentials: true
  })
  deleteUser: IResourceMethod<{companyId: number, userId: number}, IServerResponse<boolean>>;
}
