import { Injectable } from '@angular/core';
import {
  IResourceMethod,
  IResourceMethodStrict,
  Resource,
  ResourceAction,
  ResourceHandler,
  ResourceParams, ResourceQueryMappingMethod, ResourceRequestBodyType,
  ResourceRequestMethod, ResourceResponseBodyType
} from '@ngx-resource/core';
import { environment } from '../../../../environments/environment';
import { IServerResponse } from '../../../shared/interfaces/server-response.interface';
import { ISurveyDTO } from '../dto/survey.dto';
import {IQuestionDTO} from '../dto/question.dto';
import {IQuestionFormDTO} from '../dto/question-form.dto';
import {IAnswerDTO} from '../dto/answer.dto';
import {IRangeDTO} from '../dto/range.dto';
import {IHeaderDTO} from '../dto/header.dto';
import {ICodeDTO} from '../dto/code.dto';
import {IReportDTO} from '../dto/report.dto';
import {IReportFiltersDTO} from '../dto/report-filters.dto';
import {ISurveyAnswerDTO} from '../dto/survey-answer.dto';
import {ISurveyResultDTO} from '../dto/survey-result.dto';

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
   * Path: questionnaire/templates
   * Method: GET
   */
  @ResourceAction({
    path: '/questionnaire/templates',
    method: ResourceRequestMethod.Get,
    withCredentials: true
  })
  getSurveyTemplates: IResourceMethod<void, IServerResponse<ISurveyDTO[]>>;

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
    path: '/questionnaire/{!surveyId}',
    method: ResourceRequestMethod.Patch,
    withCredentials: true
  })
  editSurvey: IResourceMethodStrict<ISurveyDTO, void, {surveyId: number}, IServerResponse<ISurveyDTO>>;

  /**
   * Path: questionnaire/{!surveyId}
   * Method: DELETE
   */
  @ResourceAction({
    path: '/questionnaire/{!surveyId}',
    method: ResourceRequestMethod.Delete,
    withCredentials: true
  })
  deleteSurvey: IResourceMethod<{surveyId: number}, IServerResponse<boolean>>;

  /**
   * Path: questionnaire/{!surveyId}/set-active-status
   * Method: PATCH
   */
  @ResourceAction({
    path: '/questionnaire/{!surveyId}/set-active-status',
    method: ResourceRequestMethod.Patch,
    withCredentials: true
  })
  setSurveyStatus: IResourceMethodStrict<{is_active: number}, void,  {surveyId: number}, IServerResponse<any>>;

  /**
   * Path: questions/types
   * Method: GET
   */
  @ResourceAction({
    path: '/question/types',
    method: ResourceRequestMethod.Get
  })
  getQuestionTypes: IResourceMethod<void, IServerResponse<any>>;

  /**
   * Path: question
   * Method: POST
   */
  @ResourceAction({
    path: '/question',
    method: ResourceRequestMethod.Post,
    withCredentials: true
  })
  addQuestion: IResourceMethodStrict<IQuestionDTO, void, void, IServerResponse<IQuestionDTO>>;

  /**
   * Path: question/{!questionId}
   * Method: PATCH
   */
  @ResourceAction({
    path: '/question/{!questionId}',
    method: ResourceRequestMethod.Patch,
    withCredentials: true
  })
  editQuestion: IResourceMethodStrict<IQuestionDTO, void, {questionId: number}, IServerResponse<IQuestionDTO>>;

  /**
   * Path: question-form
   * Method: POST
   */
  @ResourceAction({
    path: '/question-form',
    method: ResourceRequestMethod.Post,
    withCredentials: true
  })
  addQuestionForm: IResourceMethodStrict<IQuestionFormDTO, void, void, IServerResponse<IQuestionFormDTO>>;

  /**
   * Path: question-form/1{!questionFormId}
   * Method: PATCH
   */
  @ResourceAction({
    path: 'question-form/{!questionFormId}',
    method: ResourceRequestMethod.Patch,
    withCredentials: true
  })
  editQuestionForm: IResourceMethodStrict<IQuestionFormDTO, void, {questionFormId: number}, IServerResponse<IQuestionFormDTO>>;

  /**
   * Path: question-form/{!questionFormId}/form-answer
   * Method: POST
   */
  @ResourceAction({
    path: '/question-form/{!questionFormId}/form-answer',
    method: ResourceRequestMethod.Post,
    withCredentials: true
  })
  addAnswer: IResourceMethodStrict<IAnswerDTO, void, {questionFormId: number}, IServerResponse<IAnswerDTO>>;

  /**
   * Path: form-answer/{!answerId}
   * Method: PATCH
   */
  @ResourceAction({
    path: '/form-answer/{!answerId}',
    method: ResourceRequestMethod.Patch,
    withCredentials: true
  })
  editAnswer: IResourceMethodStrict<IAnswerDTO, void, {answerId: number}, IServerResponse<IAnswerDTO>>;

  /**
   * Path: form-answer/{!answerId}
   * Method: DELETE
   */
  @ResourceAction({
    path: '/form-answer/{!answerId}',
    method: ResourceRequestMethod.Delete,
    withCredentials: true
  })
  deleteAnswer: IResourceMethod<{answerId: number}, IServerResponse<boolean>>;

  /**
   * Path: question-form/{!questionFormId}/question-form-range
   * Method: POST
   */
  @ResourceAction({
    path: '/question-form/{!questionFormId}/question-form-range',
    method: ResourceRequestMethod.Post,
    withCredentials: true
  })
  addRange: IResourceMethodStrict<IRangeDTO, void, {questionFormId: number}, IServerResponse<IRangeDTO>>;

  /**
   * Path: question-form-range/{!rangeId}
   * Method: PATCH
   */
  @ResourceAction({
    path: 'question-form-range/{!rangeId}',
    method: ResourceRequestMethod.Patch,
    withCredentials: true
  })
  editRange: IResourceMethodStrict<IRangeDTO, void, {rangeId: number}, IServerResponse<IRangeDTO>>;

  /**
   * Path: question/{!questionId}/attach-to-questionnaire/{!surveyId}
   * Method: POST
   */
  @ResourceAction({
    path: '/question/{!questionId}/attach-to-questionnaire/{!surveyId}',
    method: ResourceRequestMethod.Post,
    withCredentials: true
  })
  addQuestionToSurvey: IResourceMethodStrict<{prev_question_id?: number}, void, {questionId: number, surveyId: number}, IServerResponse<ISurveyDTO>>;

  /**
   * Path: question/{!questionId}
   * Method: DELETE
   */
  @ResourceAction({
    path: '/question/{!questionId}',
    method: ResourceRequestMethod.Delete,
    withCredentials: true
  })
  deleteQuestion: IResourceMethod<{questionId: number}, IServerResponse<any>>;

  /**
   * Path: questionnaire/{!surveyId}/questionnaire-code
   * Method: GET
   */
  @ResourceAction({
    path: '/questionnaire/{!surveyId}/questionnaire-code',
    method: ResourceRequestMethod.Get,
    withCredentials: true
  })
  getSurveyCodes: IResourceMethodStrict<void, void, {surveyId: number}, IServerResponse<ICodeDTO[]>>;

  /**
   * Path: questionnaire/{!surveyId}/questionnaire-code/csv
   * Method: GET
   */
  @ResourceAction({
    path: '/questionnaire/{!surveyId}/questionnaire-code/csv',
    method: ResourceRequestMethod.Get,
    withCredentials: true,
    responseBodyType: ResourceResponseBodyType.Blob,
    headers: {
      'Authorization': window.localStorage && window.localStorage['api_token'] ? `Bearer ${window.localStorage['api_token']}` : '',
      'Content-Type': 'text/csv, charset=UTF-8'
    }
  })
  downloadSurveyCodes: IResourceMethodStrict<void, void, {surveyId: number}, any>;

  /**
   * Path: questionnare/{!surveyId}/questionnaire-code
   * Method: POST
   */
  @ResourceAction({
    path: '/questionnaire/{!surveyId}/questionnaire-code',
    method: ResourceRequestMethod.Post,
    withCredentials: true
  })
  generateCodes: IResourceMethodStrict<{count: number}, void, {surveyId: number}, IServerResponse<ICodeDTO[]>>;


  @ResourceAction({
    path: '/questionnaire-template',
    method: ResourceRequestMethod.Post,
    withCredentials: true
  })
  addHeader: IResourceMethodStrict<IHeaderDTO, void, void, IServerResponse<IHeaderDTO>>;

  @ResourceAction({
    path: '/questionnaire-template/{!templateId}',
    method: ResourceRequestMethod.Patch,
    withCredentials: true
  })
  editHeader: IResourceMethodStrict<FormData, void, {templateId: number}, IServerResponse<IHeaderDTO>>;

  @ResourceAction({
    path: '/questionnaire/{!surveyId}/statistic',
    method: ResourceRequestMethod.Get,
    withCredentials: true,
    queryMappingMethod: ResourceQueryMappingMethod.Bracket
  })
  getCommonReport: IResourceMethodStrict<null, {date_from?: string, date_to?: string, restaurants_ids?: number[]}, {surveyId: number}, IServerResponse<IReportDTO>>;

  @ResourceAction({
    path: '/questionnaire/{!surveyId}/statistic/compare-restaurants',
    method: ResourceRequestMethod.Get,
    withCredentials: true,
    queryMappingMethod: ResourceQueryMappingMethod.Bracket
  })
  getCompareReport: IResourceMethodStrict<null, {date_from?: string, date_to?: string, restaurants_ids?: number[]}, {surveyId: number}, IServerResponse<IReportDTO>>;

  @ResourceAction({
    path: '/questionnaire/{!surveyId}/questionnaire-result',
    method: ResourceRequestMethod.Get,
    withCredentials: true,
    queryMappingMethod: ResourceQueryMappingMethod.Bracket
  })
  getFeedbackReport: IResourceMethodStrict<null, {date_from?: string, date_to?: string, restaurants_ids?: number[]}, {surveyId: number}, IServerResponse<ISurveyResultDTO[]>>;

  @ResourceAction({
    path: '/questionnaire-result/{!surveyId}/send-to-email',
    method: ResourceRequestMethod.Post,
    withCredentials: true
  })
  sendSurveyResultToEmail: IResourceMethodStrict<{target_email: string}, void, {surveyId: number}, IServerResponse<boolean>>;

  @ResourceAction({
    path: '/questionnaire-result/{!resultId}/set-viewed-status',
    method: ResourceRequestMethod.Patch,
    withCredentials: true
  })
  setResultViewStatus: IResourceMethodStrict<{status: number}, void, {resultId: number}, IServerResponse<boolean>>;
}
