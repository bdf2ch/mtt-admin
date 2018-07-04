import { Injectable } from '@angular/core';
import {
  IResourceMethodStrict,
  Resource,
  ResourceAction,
  ResourceHandler,
  ResourceParams,
  ResourceRequestMethod
} from '@ngx-resource/core';
import { environment } from '../../../../environments/environment';
import { IServerResponse } from '../../../shared/interfaces/server-response.interface';
import { ICompanyDTO } from '../dto/company.dto';
import { IPaymentRequisitesDTO } from '../dto/payment-requisites.dto';

@Injectable({
  providedIn: 'root'
})
@ResourceParams({
  pathPrefix: environment.apiUrl + 'company',
  withCredentials: true,
  headers: {
    'Authorization': window.localStorage && window.localStorage['api_token'] ? `Bearer ${window.localStorage['api_token']}` : ''
  }
})
export class CompanyResource extends Resource {

  constructor(handler: ResourceHandler) {
    super(handler);
  }

  /**
   * Path: company/{!id}
   * Method: GET
   */
  @ResourceAction({
    path: '/{!id}',
    method: ResourceRequestMethod.Get,
    withCredentials: true,
    headers: {
      'Authorization': window.localStorage && window.localStorage['api_token'] ? `Bearer ${window.localStorage['api_token']}` : ''
    }
  })
  getCompanyById: IResourceMethodStrict<void, {with_payment_requisites: any}, {id: number}, IServerResponse<ICompanyDTO>>;

  /**
   * Path: company/{!id}
   * Method: PATCH
   */
  @ResourceAction({
    path: '/{!id}',
    method: ResourceRequestMethod.Patch,
    withCredentials: true
  })
  editCompanyById: IResourceMethodStrict<ICompanyDTO, void, {id: number}, IServerResponse<ICompanyDTO>>;

  /**
   * Path: company/{!id}
   * Method: PATCH
   */
  @ResourceAction({
    path: '/{!companyId}',
    method: ResourceRequestMethod.Patch,
    withCredentials: true
  })
  clearRKeeperConfig: IResourceMethodStrict<ICompanyDTO, void, {companyId: number}, IServerResponse<ICompanyDTO>>;

  /**
   * Path: company/{!id}/payment-requisites
   * Method: POST
   */
  @ResourceAction({
    path: '/{!id}/payment-requisites',
    method: ResourceRequestMethod.Post,
    withCredentials: true
  })
  addPaymentRequisites: IResourceMethodStrict<IPaymentRequisitesDTO, void, {id: number}, IServerResponse<IPaymentRequisitesDTO>>;

  /**
   * Path: company/{!id}/payment-requisites/{!requisitesId}
   * Method: PATCH
   */
  @ResourceAction({
    path: '/{!id}/payment-requisites/{!requisitesId}',
    method: ResourceRequestMethod.Patch,
    withCredentials: true
  })
  editPaymentRequisites: IResourceMethodStrict<IPaymentRequisitesDTO, void, {id: number, requisitesId: number}, IServerResponse<IPaymentRequisitesDTO>>;

  /**
   * Path: company/{!id}/payment-requisites/{!requisitesId}
   * Method: DELETE
   */
  @ResourceAction({
    path: '/{!id}/payment-requisites/{!requisitesId}',
    method: ResourceRequestMethod.Delete,
    withCredentials: true
  })
  deletePaymentRequisites: IResourceMethodStrict<void, void, {id: number, requisitesId: number}, IServerResponse<boolean>>;
}
