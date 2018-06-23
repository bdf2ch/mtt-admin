import {
  IResourceMethodStrict,
  Resource,
  ResourceAction,
  ResourceHandler,
  ResourceParams,
  ResourceRequestMethod
} from '@ngx-resource/core';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
@ResourceParams({
  pathPrefix: 'https://geocode-maps.yandex.ru/1.x',
  headers: {
    'Access-Control-Allow-Origin': 'Origin',
    'Access-Control-Allow-Headers': 'ALL'
  }
})
export class YandexResource extends Resource {

  constructor(handler: ResourceHandler) {
    super(handler);
  }

  @ResourceAction({
    path: '/',
    method: ResourceRequestMethod.Get
  })
  geocode: IResourceMethodStrict<void, {geocode: string, format: string}, void, any>;
}
