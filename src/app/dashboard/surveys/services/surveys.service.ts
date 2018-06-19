import { Injectable } from '@angular/core';
import { Survey } from '../models/survey.model';
import { SurveysResource } from '../resources/surveys.resource';
import { ISurveyDTO } from '../dto/survey.dto';
import {IRestaurantDTO} from '../../restaurants/dto/restaurant.dto';
import {Restaurant} from '../../restaurants/models/restaurant.model';

@Injectable({
  providedIn: 'root'
})
export class SurveysService {
  private surveys: Survey[];
  private selectedSurvey_: Survey | null;
  private isAddingSurveyInProgress: boolean;
  private isEditingSurveyInProgress: boolean;
  private isDeletingSurveyInProgress: boolean;

  constructor(private readonly resource: SurveysResource) {
    this.surveys = [];
    this.selectedSurvey_ = null;
    this.isAddingSurveyInProgress = false;
    this.isEditingSurveyInProgress = false;
    this.isDeletingSurveyInProgress = false;
  }

  /**
   * Получение списка опросов с сервера
   * @returns {Promise<Survey[]>}
   */
  async fetchSurveyList(): Promise<Survey[]> {
    try {
      const result = await this.resource.getSurveysList();
      if (result.data) {
        result.data.forEach((item: ISurveyDTO) => {
          const survey = new Survey(item);
          this.surveys.push(survey);
        });
        console.log(this.surveys);
        return this.surveys;
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Получение списка опросов
   * @returns {Survey[]}
   */
  getSurveysList(): Survey[] {
    return this.surveys;
  }

  /**
   * Поиск опроса по идентификатору
   * @param {number} surveyId - Идентификатор опроса
   * @returns {Survey | null}
   */
  getSurveyById(surveyId: number): Survey | null {
    const findSurveyById = (item: Survey) => item.id === surveyId;
    const result = this.surveys.find(findSurveyById);
    return result ? result : null;
  }

  /**
   * Возвращает или устанавливает текущий опрос
   * @param {Survey | null} - Опрос
   * @returns {Survey | null}
   */
  selectedSurvey(survey?: Survey | null): Survey | null {
    if (survey) {
      this.selectedSurvey_ = survey;
    }
    return this.selectedSurvey_;
  }

  /**
   * Выполняетлся ли добавлени опроса
   * @returns {boolean}
   */
  addingSurveyInProgress(): boolean {
    return this.isAddingSurveyInProgress;
  }

  /**
   * Выполняется ли изменение опроса
   * @returns {boolean}
   */
  editingSurveyInProgress(): boolean {
    return this.isEditingSurveyInProgress;
  }

  /**
   * Выполняется ли удалени опроса
   * @returns {boolean}
   */
  deletingSurveyInProgress(): boolean {
    return this.isDeletingSurveyInProgress;
  }

  /**
   * Добавление опроса
   * @param {ISurveyDTO} survey - Опрос
   * @returns {Promise<Survey | null>}
   */
  async addSurvey(survey: ISurveyDTO): Promise<Survey | null> {
    try {
      this.isAddingSurveyInProgress = true;
      const result = await this.resource.addSurvey(survey, null, null);
      if (result.data) {
        this.isAddingSurveyInProgress = false;
        const survey_ = new Survey(result.data);
        this.surveys.push(survey_);
        return survey_;
      }
    } catch (error) {
      console.error(error);
      this.isAddingSurveyInProgress = false;
      return null;
    }
  }

  /**
   * Изменение опроса
   * @param {ISurveyDTO} survey - Опрос
   * @returns {Promise<Survey | null>}
   */
  async editSurvey(survey: ISurveyDTO): Promise<Survey | null> {
    try {
      this.isEditingSurveyInProgress = true;
      const result = await this.resource.editSurvey(survey, null, {surveyId: survey.id});
      if (result.data) {
        this.isEditingSurveyInProgress = false;
        this.surveys.forEach((item: Survey) => {
          if (item.id === survey.id) {
            item.title = survey.name;
            item.description = survey.description;
            item.start = new Date(survey.from);
            item.end = survey.to !== '' ? new Date(survey.to) : null;
            item.rewardId = survey.reward_id;
            item.passingCount = survey.available_passing_count;
            item.needClientDataFirst = survey.need_client_data_first;
            item.isTemplate = survey.is_template;
            item.restaurants = [];
            if (result.data.restaurants) {
              result.data.restaurants.data.forEach((rest: IRestaurantDTO) => {
                const restaurant = new Restaurant(rest);
                item.restaurants.push(restaurant);
              });
            }
            return item;
          }
        });
      }
    } catch (error) {
      console.error(error);
      this.isEditingSurveyInProgress = false;
      return null;
    }
  }
}
