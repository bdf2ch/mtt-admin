import { Injectable } from '@angular/core';
import { ResourceParams } from '@ngx-resource/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
@ResourceParams({
  pathPrefix: environment.apiUrl + ''
})
export class UsersResource {

  constructor() { }
}
