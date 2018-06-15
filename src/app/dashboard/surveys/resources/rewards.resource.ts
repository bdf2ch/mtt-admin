import { Injectable } from '@angular/core';
import { IResourceMethod, Resource, ResourceAction, ResourceHandler, ResourceParams, ResourceRequestMethod } from '@ngx-resource/core';
import { IServerResponse } from '../../../shared/interfaces/server-response.interface';
import { environment } from '../../../../environments/environment';
import { IRewardDTO } from '../dto/reward.dto';


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
export class RewardsResource extends Resource {

  constructor(handler: ResourceHandler) {
    super(handler);
  }

  /**
   * Path: reward/types
   * Method: GET
   */
  @ResourceAction({
    path: '/reward/types',
    method: ResourceRequestMethod.Get,
    withCredentials: true
  })
  getRewardTypes: IResourceMethod<void, IServerResponse<any>>;

  /**
   * Path: company/{!companyId}/reward
   * Method: GET
   */
  @ResourceAction({
    path: 'company/{!companyId}/reward',
    method: ResourceRequestMethod.Get,
    withCredentials: true
  })
  getRewards: IResourceMethod<{companyId: number}, IServerResponse<IRewardDTO[]>>;
}
