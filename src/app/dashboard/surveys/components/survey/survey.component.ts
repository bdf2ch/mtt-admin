import { Component, OnInit } from '@angular/core';
import { SurveysService } from '../../services/surveys.service';
import { RewardsService } from '../../services/rewards.service';
import { FormGroup, AbstractControl, Validators, FormBuilder } from '@angular/forms';
import { ISurveyDTO } from '../../dto/survey.dto';
import { RestaurantsService } from '../../../restaurants/services/restaurants.service';
import { Restaurant } from '../../../restaurants/models/restaurant.model';
import { ElMessageService } from 'element-angular/release/message/message.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {
  public isInEditSurveyMode: boolean;
  public surveyForm: FormGroup;
  public surveyData: ISurveyDTO;
  public restaurantIds: number[];

  constructor(private readonly formBuilder: FormBuilder,
              public readonly restaurantsService: RestaurantsService,
              public readonly surveysService: SurveysService,
              public readonly rewardsService: RewardsService,
              private readonly message: ElMessageService) {
    this.isInEditSurveyMode = false;
    this.restaurantIds = [];
    const survey = this.surveysService.selectedSurvey();
    console.log('survey', survey);
    this.surveyData = {
      id: survey.id,
      name: survey.title,
      description: survey.description,
      from: `${survey.start.getFullYear()}-${survey.start.getMonth() < 10
        ? '0' + (survey.start.getMonth() + 1).toString() : survey.start.getMonth()}-${survey.start.getDate()}`,
      to: `${survey.start.getFullYear()}-${survey.start.getMonth() < 10
        ? '0' + (survey.start.getMonth() + 1).toString() : survey.start.getMonth()}-${survey.start.getDate()}`,
      reward_id: survey.rewardId,
      available_passing_count: survey.passingCount,
      need_client_data_first: survey.needClientDataFirst,
      is_template: survey.isTemplate
    };
  }

  ngOnInit() {
    const dateRegExp = /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/;
    this.surveyForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      from: ['', [Validators.required, Validators.pattern(dateRegExp)]],
      to: ['', Validators.pattern(dateRegExp)],
      reward_id: ['', Validators.required],
      available_passing_count: ['', [Validators.required, Validators.min(1)]],
      need_client_data_first: [''],
      is_template: ['']
    });
  }

  /**
   * Открытие диалогового окна изменения опроса
   */
  openEditSurveyDialog() {
    const survey = this.surveysService.selectedSurvey();
    this.surveyData.id = this.surveyData.id;
    this.surveyData.name = survey.title;
    this.surveyData.description = survey.description;
    this.surveyData.from =
      `${survey.start.getFullYear()}-${survey.start.getMonth() < 10
        ? '0' + (survey.start.getMonth() + 1).toString() : survey.start.getMonth()}-${survey.start.getDate()}`;
    this.surveyData.to =
      `${survey.start.getFullYear()}-${survey.start.getMonth() < 10
        ? '0' + (survey.start.getMonth() + 1).toString() : survey.start.getMonth()}-${survey.start.getDate()}`;
    this.surveyData.reward_id = survey.rewardId;
    this.surveyData.available_passing_count = survey.passingCount;
    this.surveyData.need_client_data_first = survey.needClientDataFirst;
    this.surveyData.is_template = survey.isTemplate;
    this.surveyForm.reset({
      name: this.surveyData.name,
      description: this.surveyData.description,
      from: this.surveyData.from,
      to: this.surveyData.to,
      reward_id: this.surveyData.reward_id,
      available_passing_count: this.surveyData.available_passing_count,
      need_client_data_first: this.surveyData.need_client_data_first,
      is_template: this.surveyData.is_template
    });
    this.restaurantsService.getRestaurants().forEach((item: Restaurant) => {
      item.isSelected = false;
      const findRestaurantById = (restaurant: Restaurant) => item.id === restaurant.id;
      const rest = survey.restaurants.find(findRestaurantById);
      if (rest) {
        item.isSelected = true;
        this.restaurantIds.push(item.id);
      }
    });
    this.surveyForm.updateValueAndValidity();
    this.isInEditSurveyMode = true;
    console.log(this.surveyData);
  }

  /**
   * Закрытие диалогового окна изменения опроса
   */
  closeEditSurveyDialog() {
    this.isInEditSurveyMode = false;
  }

  /**
   * Получение статуса элемента формы опроса
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  surveyFormStatusCtrl(item: string): string {
    if (!this.surveyForm.controls[item]) { return; }
    const control: AbstractControl = this.surveyForm.controls[item];
    return control.dirty && control.hasError('required') || control.hasError('pattern') || control.hasError('min') ? 'error' : 'validating';
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
        return control.dirty && control.hasError('required')
          ? 'Вы не указали количество прохождений' : control.hasError('min')
            ? 'Количество прохождений не может быть меньше 1' : '';
    }
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
    this.surveyForm.markAsDirty();
    this.surveyForm.updateValueAndValidity();
  }

  /**
   * Изменение статуса показа контактов клиента
   * @param {boolean} value - Статус
   */
  changeNeedClientDataFirstStatus(value: boolean) {
    this.surveyForm.markAsDirty();
  }

  /**
   * Изменение статуса отметки является ли опрос шаблоном
   * @param {boolean} value - Статус
   */
  changeIsTemplateStatus(value: boolean) {
    this.surveyForm.markAsDirty();
  }

  /**
   * Изменение опроса
   * @returns {Promise<void>}
   */
  async editSurvey() {
    this.surveyData.restaurants_ids = this.restaurantIds;
    await this.surveysService.editSurvey(this.surveyData)
      .then(() => {
        this.closeEditSurveyDialog();
        this.message['success']('Опрос добавлен');
      });
  }
}
