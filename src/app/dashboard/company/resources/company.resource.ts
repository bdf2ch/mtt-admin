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
import { IServerResponse } from '../../../shared/interfaces/server-response.interface';
import { ICompanyDTO } from '../dto/company.dto';

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
  getCompanyById: IResourceMethodStrict<void, {withPaymentRequisites: any}, {id: number}, IServerResponse<ICompanyDTO>>;

  @ResourceAction({
    path: '/{!id}',
    method: ResourceRequestMethod.Patch
  })
  editCompanyById: IResourceMethodStrict<ICompanyDTO, void, {id: number}, IServerResponse<ICompanyDTO>>;
}
