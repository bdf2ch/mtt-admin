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
import { IRestaurantDTO } from '../dto/restaurant.dto';
import { ITimeTableDTO } from '../dto/time-table.dto';
import { ISocialNetworkDTO } from '../dto/social-network.dto';
import { IAddressDTO } from '../dto/address.dto';

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
export class RestaurantsResource extends Resource {

  constructor(handler: ResourceHandler) {
    super(handler);
  }

  @ResourceAction({
    path: '/company/{!id}/restaurant',
    method: ResourceRequestMethod.Get
  })
  getRestaurantsByCompanyId: IResourceMethod<{id: number}, IServerResponse<IRestaurantDTO[]>>;

  @ResourceAction({
    path: '/company/{!id}/restaurant',
    method: ResourceRequestMethod.Post
  })
  addRestaurant: IResourceMethodStrict<IRestaurantDTO, void, {id: number}, IServerResponse<IRestaurantDTO>>;

  @ResourceAction({
    path: '/company/{!companyId}/restaurant/{!restaurantId}',
    method: ResourceRequestMethod.Patch,
    withCredentials: true
  })
  editRestaurant: IResourceMethodStrict<IRestaurantDTO, void, {companyId: number, restaurantId: number}, IServerResponse<IRestaurantDTO>>;

  @ResourceAction({
    path: '/company/{!companyId}/restaurant/{!restaurantId}',
    method: ResourceRequestMethod.Delete,
    withCredentials: true
  })
  deleteRestaurant: IResourceMethod<{companyId: number, restaurantId: number}, IServerResponse<boolean>>;

  @ResourceAction({
    path: '/restaurant/{!restaurantId}/address',
    method: ResourceRequestMethod.Post,
    withCredentials: true
  })
  addAddress: IResourceMethodStrict<IAddressDTO, void, {restaurantId: number}, IServerResponse<IAddressDTO>>;

  @ResourceAction({
    path: '/restaurant/{!restaurantId}/address/{!addressId}',
    method: ResourceRequestMethod.Patch,
    withCredentials: true
  })
  editAddress: IResourceMethodStrict<IAddressDTO, void, {restaurantId: number, addressId: number}, IServerResponse<IAddressDTO>>;

  @ResourceAction({
    path: '/restaurant/{!restaurantId}/work-interval',
    method: ResourceRequestMethod.Post,
    withCredentials: true
  })
  addTimeTable: IResourceMethodStrict<ITimeTableDTO, void, {restaurantId: number}, IServerResponse<ITimeTableDTO>>;

  @ResourceAction({
    path: '/restaurant/{!restaurantId}/work-interval/{!timeTableId}',
    method: ResourceRequestMethod.Patch,
    withCredentials: true
  })
  editTimeTable: IResourceMethodStrict<ITimeTableDTO, void, {restaurantId: number, timeTableId: number}, IServerResponse<ITimeTableDTO>>;

  @ResourceAction({
    path: '/restaurant/{!restaurantId}/social-network',
    method: ResourceRequestMethod.Post,
    withCredentials: true
  })
  addSocialNetwork: IResourceMethodStrict<ISocialNetworkDTO, void, {restaurantId: number}, IServerResponse<ISocialNetworkDTO>>;

  @ResourceAction({
    path: '/restaurant/{!restaurantId}/social-network/{!socialNetworkId}',
    method: ResourceRequestMethod.Delete,
    withCredentials: true
  })
  deleteSocialNetwork: IResourceMethod<{restaurantId: number, socialNetworkId: number}, IServerResponse<boolean>>;
}
