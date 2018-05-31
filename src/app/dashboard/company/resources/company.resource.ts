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

  @ResourceAction({
    path: '/{!id}',
    method: ResourceRequestMethod.Get
  })
  getCompanyById: IResourceMethodStrict<void, {with_payment_requisites: any}, {id: number}, IServerResponse<ICompanyDTO>>;

  @ResourceAction({
    path: '/{!id}',
    method: ResourceRequestMethod.Patch
  })
  editCompanyById: IResourceMethodStrict<ICompanyDTO, void, {id: number}, IServerResponse<ICompanyDTO>>;

  @ResourceAction({
    path: '/{!id}/payment-requisites',
    method: ResourceRequestMethod.Post
  })
  addPaymentRequisites: IResourceMethodStrict<IPaymentRequisitesDTO, void, {id: number}, IServerResponse<IPaymentRequisitesDTO>>;

  @ResourceAction({
    path: '/{!id}/payment-requisites/{!requisitesId}',
    method: ResourceRequestMethod.Patch
  })
  editPaymentRequisites: IResourceMethodStrict<IPaymentRequisitesDTO, void, {id: number, requisitesId: number}, IServerResponse<IPaymentRequisitesDTO>>;

  @ResourceAction({
    path: '/{!id}/payment-requisites/{!requisitesId}',
    method: ResourceRequestMethod.Delete
  })
  deletePaymentRequisites: IResourceMethodStrict<void, void, {id: number, requisitesId: number}, IServerResponse<boolean>>;
}
