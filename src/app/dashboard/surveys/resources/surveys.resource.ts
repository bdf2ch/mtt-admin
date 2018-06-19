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
import { ISurveyDTO } from '../dto/survey.dto';

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
export class SurveysResource extends Resource {

  constructor(handler: ResourceHandler) {
    super(handler);
  }

  /**
   * Path: /questionnaire
   * Method: GET
   */
  @ResourceAction({
    path: '/questionnaire',
    method: ResourceRequestMethod.Get,
    withCredentials: true
  })
  getSurveysList: IResourceMethod<void, IServerResponse<ISurveyDTO[]>>;

  /**
   * Path:
   * Method: GET
   */
  @ResourceAction({
    path: '',
    method: ResourceRequestMethod.Get,
    withCredentials: true
  })
  getQuestionTypes: IResourceMethod<void, IServerResponse<any>>;

  /**
   * Path: questionnaire
   * Method: POST
   */
  @ResourceAction({
    path: '/questionnaire',
    method: ResourceRequestMethod.Post,
    withCredentials: true
  })
  addSurvey: IResourceMethodStrict<ISurveyDTO, void, void, IServerResponse<ISurveyDTO>>;

  /**
   * Path: questionnaire/{!surveyId}
   * Method: PATCH
   */
  @ResourceAction({
    path: 'questionnaire/{!surveyId}',
    method: ResourceRequestMethod.Patch,
    withCredentials: true
  })
  editSurvey: IResourceMethodStrict<ISurveyDTO, void, {surveyId: number}, IServerResponse<ISurveyDTO>>;
}
