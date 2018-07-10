import { Injectable } from '@angular/core';
import { YandexResource } from '../resources/yandex.resource';
import { IGeoPosition } from '../interfaces/geo-position.interface';
import { environment } from './../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class YandexService {

  constructor(private readonly resource: YandexResource) {}

  async getGeoPosition(address: string): Promise<any> {
    try {
      const result = await this.resource.geocode(null, {geocode: address, format: 'json'}, null);
      if (result) {
        const position = result['response']['GeoObjectCollection']['featureMember'][0]['GeoObject']['Point'].split(' ');
        const geo: IGeoPosition = {
          latitude: position[0],
          longitude: position[1]
        };
        return geo;
      }
      console.log(result);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
