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
import { IRestaurant } from '../interfaces/restaurant.interface';
import { IServerResponse } from '../../../shared/interfaces/server-response.interface';
import { IRestaurantDTO } from '../dto/restaurant.dto';

@Injectable({
  providedIn: 'root'
})
@ResourceParams({
  pathPrefix: environment.apiUrl + '/company',
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
    path: '/{!id}/restaurant',
    method: ResourceRequestMethod.Get
  })
  getRestaurantsByCompanyId: IResourceMethod<{id: number}, IServerResponse<IRestaurantDTO[]>>;

  @ResourceAction({
    path: '/{!id}/restaurant',
    method: ResourceRequestMethod.Post
  })
  addRestaurant: IResourceMethodStrict<IRestaurantDTO, void, {id: number}, IServerResponse<IRestaurantDTO>>;
}
