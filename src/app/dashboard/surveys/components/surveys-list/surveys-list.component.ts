import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SurveysService } from '../../services/surveys.service';
import { Survey } from '../../models/survey.model';
import { RestaurantsService } from '../../../restaurants/services/restaurants.service';
import { ISurveyDTO } from '../../dto/survey.dto';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { RewardsService } from '../../services/rewards.service';
import { Restaurant } from '../../../restaurants/models/restaurant.model';
import { ElMessageService } from 'element-angular/release/message/message.service';

@Component({
  selector: 'app-surveys-list',
  templateUrl: './surveys-list.component.html',
  styleUrls: ['./surveys-list.component.scss']
})
export class SurveysListComponent implements OnInit {
  public isInAddSurveyMode: boolean;
  public isInEditSurveyDialog: boolean;
  public isInDeleteSurveyDialog: boolean;
  public selectedSurvey: Survey | null;
  public surveyData: ISurveyDTO;
  public surveyForm: FormGroup;
  public restaurantIds: number[];
  public templateId: number;

  constructor(private readonly router: Router,
              private readonly formBuilder: FormBuilder,
              public readonly surveysService: SurveysService,
              public readonly rewardsService: RewardsService,
              public readonly restaurantsService: RestaurantsService,
              private readonly message: ElMessageService) {
    this.isInAddSurveyMode = false;
    this.isInEditSurveyDialog = false;
    this.isInDeleteSurveyDialog = false;
    this.selectedSurvey = null;
    this.restaurantIds = [];
    this.templateId = 0;
    this.surveyData = {
      id: 0,
      name: '',
      description: '',
      company_id: 0,
      reward_id: 0,
      from: '',
      to: null,
      available_passing_count: 100,
      is_template: false,
      is_active: true
    };
  }

  ngOnInit() {
    const dateRegExp = /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/;
    this.surveyForm = this.formBuilder.group({
      name: [this.surveyData.name, Validators.required],
      description: [this.surveyData.description],
      reward_id: [this.rewardsService.getAvailableRewards().length > 0 ? this.rewardsService.getAvailableRewards()[0].id : null, Validators.required],
      template_id: [this.templateId]
    });
  }

  /**
   * Открытите диалогвого окна добавления опроса
   */
  openAddSurveyDialog() {
    this.surveyData = {
      id: 0,
      name: '',
      description: '',
      company_id: 0,
      reward_id: this.rewardsService.getAvailableRewards().length > 0 ? this.rewardsService.getAvailableRewards()[0].id : null,
      from: '',
      to: null,
      available_passing_count: 100,
      is_template: false,
      is_active: true
    };
    this.surveyForm.reset({
      name: this.surveyData.name,
      description: this.surveyData.description,
      reward_id: this.surveyData.reward_id
    });
    this.restaurantIds = [];
    this.restaurantsService.getRestaurants().forEach((item: Restaurant) => {
      item.isSelected = false;
    });
    console.log(this.surveyData);
    this.isInAddSurveyMode = true;
  }

  /**
   * Закрытие диалогового окна добавления опроса
   */
  closeAddSurveyDialog() {
    this.isInAddSurveyMode = false;
  }

  /**
   * Открытите диалогового окна изменения опроса
   */
  openEditSurveyDialog() {
    this.isInEditSurveyDialog = true;
  }

  /**
   * Закрытие диалогового окна изменения опроса
   */
  closeEditSurveyDialog() {
    this.isInEditSurveyDialog = false;
  }

  /**
   * Открытие диалогового окна подтверждения удаления опроса
   * @param {Survey} survey - Опрос
   */
  openDeleteSurveyDialog(survey: Survey) {
    this.selectedSurvey = survey;
    this.isInDeleteSurveyDialog = true;
  }

  /**
   * Закрытие диалогового окна подтверждения удаления опроса
   */
  closeDeleteSurveyDialog() {
    this.isInDeleteSurveyDialog = false;
    this.selectedSurvey = null;
  }

  /**
   * Получение статуса элемента формы опроса
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  surveyFormStatusCtrl(item: string): string {
    if (!this.surveyForm.controls[item]) { return; }
    const control: AbstractControl = this.surveyForm.controls[item];
    return control.dirty && control.hasError('required') || control.hasError('pattern') ? 'error' : 'validating';
  }

  /**
   * Получение сообщения об ошибке элемента формы опроса
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  surveyFormMessageCtrl(item: string): string {
    if (!this.surveyForm.controls[item]) { return; }
    const control: AbstractControl = this.surveyForm.controls[item];
    switch (item) {
      case 'name':
        return control.dirty && control.hasError('required') ? 'Вы не указали наименование' : '';
      case 'reward_id':
        return control.dirty && control.hasError('required') ? 'Вы не выбрали вознаграждение' : '';
      case 'from':
        return control.dirty && control.hasError('required')
          ? 'Вы не указали дату начала действия' : control.hasError('pattern')
            ? 'Дата начала должна быть в формате ГГГГ-М-ДД' : '';
      case 'to':
        return control.dirty && control.hasError('required') ?
          'Вы не указали дату окончания действия' : control.hasError('pattern')
            ? 'Дата окончания должна быть в формате ГГГГ-ММ-ДД' : '';
      case 'available_passing_count':
        return control.dirty && control.hasError('required') ? 'Вы не указали количество прохождений' : '';
    }
  }

  /**
   * Удаление ресторана из списка ресторанов, которые участвуют в опросе
   * @param {Restaurant} restaurant - Ресторан
   */
  removeRestaurant(restaurant: Restaurant) {
    this.restaurantIds.forEach((item: number, index: number, array: number[]) => {
      if (item === restaurant.id) {
        array.splice(index, 1);
      }
    });
  }

  /**
   * Изменение статуса выбора ресторана, участвующего в опросе
   * @param {boolean} value
   * @param {Restaurant} restaurant
   */
  changeRestaurantsStatus(value: boolean, restaurant: Restaurant) {
    restaurant.isSelected = value;
    if (value === true) {
      this.restaurantIds.push(restaurant.id);
    } else {
      this.restaurantIds.forEach((item: number, index: number, array: number[]) => {
        if (item === restaurant.id) {
          array.splice(index, 1);
        }
      });
    }
    this.surveyForm.updateValueAndValidity();
  }

  /**
   * Добавлени опроса
   * @returns {Promise<void>}
   */
  async addSurvey() {
    delete this.surveyData.id;
    delete this.surveyData.company_id;
    delete this.surveyData.from;
    delete this.surveyData.to;
    delete this.surveyData.is_template;
    delete this.surveyData.is_active;
    delete this.surveyData.available_passing_count;
    if (this.templateId !== 0) {
      this.surveyData.template_id = this.templateId;
    }
    this.surveyData.restaurants_ids = this.restaurantIds;

    console.log(this.surveyData);
    await this.surveysService.addSurvey(this.surveyData)
      .then(() => {
        this.closeAddSurveyDialog();
        this.message['success']('Опрос добавлен');
      });
  }

}
