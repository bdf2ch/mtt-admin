import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SurveysService } from '../../services/surveys.service';
import { RewardsService } from '../../services/rewards.service';
import { FormGroup, AbstractControl, Validators, FormBuilder, FormControl } from '@angular/forms';
import { ISurveyDTO } from '../../dto/survey.dto';
import { RestaurantsService } from '../../../restaurants/services/restaurants.service';
import { Restaurant } from '../../../restaurants/models/restaurant.model';
import { ElMessageService } from 'element-angular/release/message/message.service';
import { IQuestionDTO } from '../../dto/question.dto';
import { IQuestionFormDTO } from '../../dto/question-form.dto';
import { IAnswerDTO } from '../../dto/answer.dto';
import { IRangeDTO } from '../../dto/range.dto';
import { Question } from '../../models/question.model';
import { Answer } from '../../models/answer.model';
import { ITemplateDTO } from '../../dto/template.dto';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {
  public isInEditSurveyMode: boolean;
  public isInAddQuestionMode: boolean;
  public isInEditQuestionMode: boolean;
  public isInDeleteQuestionMode: boolean;
  public isInGenerateCodesMode: boolean;
  public isInShowSurveyCodesMode: boolean;
  public surveyForm: FormGroup;
  public surveyData: ISurveyDTO;
  public questionForm: FormGroup;
  public questionData: IQuestionDTO;
  public questionFormData: IQuestionFormDTO;
  public answerForm: FormGroup;
  public newAnswerForm: FormGroup;
  public answerData: IAnswerDTO;
  public restaurantIds: number[];
  public answers: IAnswerDTO[];
  public minAnswers: number;
  public rangeData: IRangeDTO;
  public selectedQuestion: Question | null;
  public codesAmount: number;
  public codesForm: FormGroup;
  public headerData: ITemplateDTO;
  public headerImage: File | null;
  public footerData: ITemplateDTO;
  public footerImage: File | null;

  constructor(private readonly router: Router,
              private readonly formBuilder: FormBuilder,
              public readonly restaurantsService: RestaurantsService,
              public readonly surveysService: SurveysService,
              public readonly rewardsService: RewardsService,
              private readonly message: ElMessageService) {
    this.isInEditSurveyMode = false;
    this.isInAddQuestionMode = false;
    this.isInEditQuestionMode = false;
    this.isInDeleteQuestionMode = false;
    this.isInGenerateCodesMode = false;
    this.isInShowSurveyCodesMode = false;
    this.restaurantIds = [];
    this.selectedQuestion = null;
    this.codesAmount = 50;
    this.headerImage = null;
    this.footerImage = null;
    const survey = this.surveysService.selectedSurvey();
    console.log('survey', survey);
    this.surveyData = {
      id: survey.id,
      name: survey.title,
      description: survey.description,
      from: `${survey.start.getFullYear()}-${survey.start.getMonth() < 10
        ? '0' + (survey.start.getMonth() + 1).toString() : survey.start.getMonth()}-${survey.start.getDate()}`,
      to: survey.end ? `${survey.end.getFullYear()}-${survey.end.getMonth() < 10
        ? '0' + (survey.end.getMonth() + 1).toString() : survey.end.getMonth()}-${survey.end.getDate()}` : null,
      reward_id: survey.rewardId,
      available_passing_count: survey.passingCount,
      need_client_data_first: survey.needClientDataFirst,
      is_template: survey.isTemplate
    };
    this.questionData = {
      id: 0,
      company_id: 0,
      title: '',
      weight: 0,
      type: this.surveysService.getQuestionTypesList().length > 0 ? this.surveysService.getQuestionTypesList()[0].code : null
    };
    this.questionFormData = {
      question_id: 0,
      // type: this.surveysService.getQuestionTypeByCode(this.questionData.type).forms[0].code
      type: null
    };
    this.answerData = {
      text_content: ''
    };
    this.rangeData = {
      min: 0,
      max: 1
    };
    this.answers = [];
    this.headerData = {
      type: 'header',
      url: '',
      text_content: '',
      background_color: '',
      image: null
    };
    this.footerData = {
      type: 'footer',
      url: '',
      text_content: '',
      background_color: '',
      image: null
    };
  }

  ngOnInit() {
    const dateRegExp = /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/;
    const siteRegExp = /^https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,}$/;
    this.surveyForm = this.formBuilder.group({
      name: [this.surveyData.name, Validators.required],
      description: [this.surveyData.description],
      from: [this.surveyData.from, [Validators.required, Validators.pattern(dateRegExp)]],
      to: [this.surveyData.to, Validators.pattern(dateRegExp)],
      reward_id: [this.surveyData.reward_id, Validators.required],
      available_passing_count: [this.surveyData.available_passing_count, [Validators.required, Validators.min(1)]],
      need_client_data_first: [this.surveyData.need_client_data_first],
      is_template: [this.surveyData.is_template],
      header_url: [this.headerData.url, [Validators.pattern(siteRegExp)]],
      header_text_content: [this.headerData.text_content],
      header_background_color: [this.headerData.background_color],
      footer_url: [this.footerData.url, [Validators.pattern(siteRegExp)]],
      footer_text_content: [this.footerData.text_content],
      footer_background_color: [this.footerData.background_color]
    });
    this.questionForm = this.formBuilder.group({
      title: [this.questionData.title, Validators.required],
      weight: [this.questionData.weight, Validators.required],
      type: [this.questionData.type, Validators.required],
      form_type: [this.questionFormData.type, Validators.required]
    });
    this.answerForm = this.formBuilder.group({
      text: [this.answerData.text_content, Validators.required]
    });
    this.codesForm = this.formBuilder.group({
      count: [this.codesAmount, [Validators.required, Validators.min(1)]]
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
        ? '0' + (survey.start.getMonth() + 1).toString() : survey.start.getMonth()}-${survey.start.getDate() < 10 ? '0' + survey.start.getDate().toString() : survey.start.getDate()}`;
    if (survey.end) {
      this.surveyData.to =
        `${survey.end.getFullYear()}-${survey.end.getMonth() < 10
          ? '0' + (survey.end.getMonth() + 1).toString() : survey.end.getMonth()}-${survey.end.getDate() < 10 ? '0' + survey.end.getDate().toString() : survey.end.getDate()}`;
    } else {
      this.surveyData.to = null;
    }
    this.surveyData.reward_id = survey.rewardId;
    this.surveyData.available_passing_count = survey.passingCount;
    this.surveyData.need_client_data_first = survey.needClientDataFirst;
    this.surveyData.is_template = survey.isTemplate;
    /*
    this.headerData.id = survey.header.id;
    this.headerData.type = survey.header.type;
    this.headerData.url = survey.header.url;
    this.headerData.background_color = survey.header.backgroundColor;
    this.headerData.text_content = survey.header.content;
    this.headerData.image_url = survey.header.imageUrl;
    this.footerData.id = survey.footer.id;
    this.footerData.type = survey.footer.type;
    this.footerData.url = survey.footer.url;
    this.footerData.background_color = survey.footer.backgroundColor;
    this.footerData.text_content = survey.footer.content;
    this.footerData.image_url = survey.footer.imageUrl;
    */
    this.headerImage = null;
    this.footerImage = null;
    survey.header.image = null;
    survey.footer.image = null;
    this.surveyForm.reset({
      name: this.surveyData.name,
      description: this.surveyData.description,
      from: this.surveyData.from,
      to: this.surveyData.to,
      reward_id: this.surveyData.reward_id,
      available_passing_count: this.surveyData.available_passing_count,
      need_client_data_first: this.surveyData.need_client_data_first,
      is_template: this.surveyData.is_template,
      header_url: survey.header.url,
      header_text_content: survey.header.content,
      header_background_color: survey.header.backgroundColor,
      footer_url: survey.footer.url,
      footer_text_content: survey.footer.content,
      footer_background_color: survey.footer.backgroundColor
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
   * Открытие диалогового окна добавлени вопроса
   */
  openAddQuestionDialog() {
    this.questionData = {
      id: 0,
      company_id: 0,
      title: '',
      weight: 0,
      type: this.surveysService.getQuestionTypesList().length > 0 ? this.surveysService.getQuestionTypesList()[0].code : null
    };
    this.questionFormData = {
      question_id: 0,
      // type: this.surveysService.getQuestionTypeByCode(this.questionData.type).forms[0].code
      type: null
    };
    this.answerData = {
      text_content: ''
    };
    this.questionForm.reset({
      title: this.questionData.title,
      type: this.questionData.type,
      weight: this.questionData.weight,
      form_type: this.questionFormData.type
    });
    this.answerForm.reset();
    for (const control in this.answerForm.controls) {
      this.answerForm.removeControl(control);
    }
    switch (this.questionFormData.type) {
      case 'text_input':
        this.minAnswers = 0;
        break;
      case 'checkbox':
        this.minAnswers = 2;
        const answer: IAnswerDTO = {
          text_content: '',
          dateCreated: new Date().getTime()
        };
        this.answers.push(answer);
        this.answerForm.addControl(`answer${answer.dateCreated}`, new FormControl(answer.text_content, Validators.required));
        break;
    }
    this.answerForm.updateValueAndValidity();
    this.answers = [];
    this.isInAddQuestionMode = true;
  }

  /**
   * Закрытие диалогового окна добавления вопрсоа
   */
  closeAddQuestionDialog() {
    this.isInAddQuestionMode = false;
  }

  /**
   * Открытие диалогвого окна изменения вопроса
   */
  openEditQuestionDialog(question: Question) {
    this.selectedQuestion = question;
    this.answers = [];
    this.questionData.id = question.id;
    this.questionData.company_id = question.companyId;
    this.questionData.type = question.type;
    this.questionData.title = question.title;
    this.questionData.weight = question.weight;
    this.questionFormData.id = question.form.id;
    this.questionFormData.type = question.form.type;
    this.questionFormData.question_id = question.form.questionId;
    this.questionFormData.company_id = question.form.companyId;
    console.log(this.questionFormData);
    if (question.range) {
      this.rangeData.id = question.range.id;
      this.rangeData.company_id = question.range.companyId;
      this.rangeData.question_form_id = question.form.id;
      this.rangeData.min = question.range.min;
      this.rangeData.max = question.range.max;
    }
    this.questionForm.reset({
      title: this.questionData.title,
      type: this.questionData.type,
      weight: this.questionData.weight,
      form_type: this.questionFormData.type
    });
    question.answers.forEach((answer: Answer) => {
      const answer_: IAnswerDTO = {
        id: answer.id,
        question_form_id: question.form.id,
        index: answer.index,
        weight: answer.weight,
        text_content: answer.content
      };
      this.answers.push(answer_);
    });
    for (const item in this.answerForm.controls) {
      this.answerForm.removeControl(item);
    }
    console.log('type', this.questionFormData.type);
    switch (this.questionFormData.type) {
      case 'text_input':
        this.minAnswers = 0;
        break;
      case 'checkbox':
        this.minAnswers = 2;
        this.answers.forEach((item: IAnswerDTO) => {
          this.answerForm.addControl(`answer${item.id}`, new FormControl(item.text_content, Validators.required));
          this.answerForm.addControl(`weight${item.id}`, new FormControl(item.weight));
          this.answerForm.get(`answer${item.id}`).reset(item.text_content);
          this.answerForm.get(`weight${item.id}`).reset(item.weight);
        });
        break;
      case 'radio_button':
        this.minAnswers = 2;
        this.answers.forEach((item: IAnswerDTO) => {
          this.answerForm.addControl(`answer${item.id}`, new FormControl(item.text_content, Validators.required));
          this.answerForm.addControl(`weight${item.id}`, new FormControl(item.weight));
          this.answerForm.get(`answer${item.id}`).reset(item.text_content);
          this.answerForm.get(`weight${item.id}`).reset(item.weight);
        });
        break;
      case 'mark':
        console.log('mark');
        this.minAnswers = 0;
        this.answerForm.addControl('range_min', new FormControl(this.rangeData.min, Validators.required));
        this.answerForm.addControl('range_max', new FormControl(this.rangeData.max, Validators.required));
        this.answerForm.get('range_min').reset(this.rangeData.min);
        this.answerForm.get('range_max').reset(this.rangeData.max);
        console.log(this.answerForm);
        break;
    }
    this.answerForm.updateValueAndValidity();
    this.isInEditQuestionMode = true;
    console.log(this.answerForm);
  }

  /**
   * Закрытие диалогового окна изменения вопроса
   */
  closeEditQuestionDialog() {
    this.isInEditQuestionMode = false;
    this.selectedQuestion = null;
  }

  /**
   * Открытие диалогового окна подтверждения удаления вопроса
   */
  openDeleteQuestionDialog(question: Question) {
    this.selectedQuestion = question;
    this.isInDeleteQuestionMode = true;
  }

  /**
   * Закрытие диалогового окна подтверждения удаления вопроса
   */
  closeDeleteQuestionDialog() {
    this.isInDeleteQuestionMode = false;
    this.selectedQuestion = null;
  }

  /**
   * Открытие диалогового окна генерации кодов опроса
   */
  openGenerateCodesDialog() {
    this.codesAmount = 50;
    this.codesForm.reset({
      count: this.codesAmount
    });
    this.isInGenerateCodesMode = true;
  }

  /**
   * Закрытие диалогового окна генерации кодов опроса
   */
  closeGenerateCodesDialog() {
    this.isInGenerateCodesMode = false;
  }

  /**
   * Открытие диалогового окна с кодами прохождения опроса
   */
  openSurveyCodesDialog() {
    this.isInShowSurveyCodesMode = true;
  }

  /**
   * Закрытие диалогового окна с кодами прохождения опроса
   */
  closeSurveyCodesDilaog() {
    this.isInShowSurveyCodesMode = false;
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
      case 'header_url':
        return control.dirty && control.hasError('required')
          ? 'Вы не указали ссылку шапки' : control.hasError('pattern')
            ? 'Ссыллка шапки указана некорректно' : '';
      case 'header_background_color':
        return control.dirty && control.hasError('required') ? 'Вы не указали цвет фона шапки' : '';
      case 'header_text_content':
        return control.dirty && control.hasError('required') ? 'Вы не указали содержимое шапки' : '';
      case 'footer_url':
        return control.dirty && control.hasError('required')
          ? 'Вы не указали ссылку подвала' : control.hasError('pattern')
            ? 'Ссыллка подвала указана некорректно' : '';
      case 'footer_background_color':
        return control.dirty && control.hasError('required') ? 'Вы не указали цвет фона подвала' : '';
      case 'footer_text_content':
        return control.dirty && control.hasError('required') ? 'Вы не указали содержимое подвала' : '';
    }
  }

  /**
   * Получение статуса элемента формы вопроса
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  questionFormStatusCtrl(item: string): string {
    if (!this.questionForm.controls[item]) { return; }
    const control: AbstractControl = this.questionForm.controls[item];
    return control.dirty && control.hasError('required') || control.hasError('pattern') ? 'error' : 'validating';
  }

  /**
   * Получение сообщения об ошибке элемента формы вопроса
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  questionFormMessageCtrl(item: string): string {
    if (!this.questionForm.controls[item]) { return; }
    const control: AbstractControl = this.questionForm.controls[item];
    switch (item) {
      case 'title':
        return control.dirty && control.hasError('required') ? 'Вы не указали текст вопроса' : '';
      case 'weight':
        return control.dirty && control.hasError('required') ? 'Вы не указали вес вопроса' : '';
      case 'type':
        return control.dirty && control.hasError('required') ? 'Вы не выбрали тип вопроса' : '';
      case 'form_type':
        return control.dirty && control.hasError('required') ? 'Вы не выбрали тип формы вопроса' : '';
    }
  }

  /**
   * Получение статуса элемента формы ответа
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  answerFormStatusCtrl(item: string): string {
    if (!this.answerForm.controls[item]) { return; }
    const control: AbstractControl = this.answerForm.controls[item];
    switch (item) {
      case 'range_max':
        return control.dirty && (control.hasError('required') || parseInt(control.value) <= this.rangeData.min) ? 'error' : 'validating';
      default:
        return control.dirty && control.hasError('required') ? 'error' : 'validating';
    }
  }

  /**
   * Получение сообщения об ошибке элемента формы ответа
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  answerFormMessageCtrl(item: string): string {
    if (!this.answerForm.controls[item]) { return; }
    const control: AbstractControl = this.answerForm.controls[item];
    switch (item) {
      case 'text':
        return control.dirty && control.hasError('required') ? 'Вы не указали текст ответа' : '';
      case 'weight':
        return control.dirty && control.hasError('required') ? 'Вы не указали вес ответа' : '';
      case 'range_min':
        return control.dirty && control.hasError('required') ? 'Вы не указали минимальное значение' : '';
      case 'range_max':
        return control.dirty && control.hasError('required')
          ? 'Вы не указали максимальное значение' : parseInt(control.value) <= this.rangeData.min
            ? 'Макс. значение не может быть меньше минимального' : '';
    }
  }

  /**
   * Получение статуса элемента формы опроса
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  codesFormStatusCtrl(item: string): string {
    if (!this.codesForm.controls[item]) { return; }
    const control: AbstractControl = this.codesForm.controls[item];
    return control.dirty && control.hasError('required') || control.hasError('min') ? 'error' : 'validating';
  }

  /**
   * Получение сообщения об ошибке элемента формы опроса
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  codesFormMessageCtrl(item: string): string {
    if (!this.surveyForm.controls[item]) { return; }
    const control: AbstractControl = this.surveyForm.controls[item];
    switch (item) {
      case 'count':
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
   * Изменение типа вопроса
   * @param value - Код типа вопроса
   */
  questionTypeChange(value: any) {
    const questionType = this.surveysService.getQuestionTypeByCode(value);
    this.questionFormData.type = null;
    this.questionForm.markAsDirty();
    /**
    if (questionType.forms.length > 0) {
      this.questionFormData.type = questionType.forms[0].code;
    }
     **/
  }

  /**
   * Изменение типа формы вопроса
   * @param value - Код типа вопроса
   */
  questionFormChange(value: any) {
    console.log(value);
    this.answers = [];
    for (const control in this.answerForm.controls) {
      this.answerForm.removeControl(control);
    }
    const answer: IAnswerDTO = {
      id: 0,
      text_content: '',
      dateCreated: new Date().getTime()
    };
    switch (value) {
      case 'text_input':
        this.minAnswers = 0;
        break;
      case 'checkbox':
        this.minAnswers = 2;
        this.answers.push(answer);
        this.answerForm.addControl(`answer${answer.dateCreated}`, new FormControl(answer.text_content, Validators.required));
        this.answerForm.addControl(`weight${answer.dateCreated}`, new FormControl(answer.weight));
        break;
      case 'radio_button':
        this.minAnswers = 2;
        this.answers.push(answer);
        this.answerForm.addControl(`answer${answer.dateCreated}`, new FormControl(answer.text_content, Validators.required));
        this.answerForm.addControl(`weight${answer.dateCreated}`, new FormControl(answer.weight));
        break;
      case 'mark':
        console.log('mark');
        this.minAnswers = 0;
        this.answerForm.addControl('range_min', new FormControl(this.rangeData.min, Validators.required));
        this.answerForm.addControl('range_max', new FormControl(this.rangeData.max, Validators.required));
        this.answerForm.get('range_min').reset(this.rangeData.min);
        this.answerForm.get('range_max').reset(this.rangeData.max);
        console.log(this.answerForm);
        break;
    }
    this.questionForm.markAsDirty();
    //this.answerForm.updateValueAndValidity();
    console.log(this.answerForm);
  }


  /**
   * Добавление ответа в форму добавления вопроса
   */
  appendAnswer() {
    const answer: IAnswerDTO = {
      id: 0,
      text_content: '',
      dateCreated: new Date().getTime()
    };
    this.answers.push(answer);
    this.answerForm.addControl(`answer${answer.dateCreated}`, new FormControl(answer.text_content, Validators.required));
    this.answerForm.addControl(`weight${answer.dateCreated}`, new FormControl(answer.weight));
  }

  /**
   * Удаление ответа из формы добавления вопроса
   * @param {IAnswerDTO} answer - Ответ
   */
  removeAnswer(answer: IAnswerDTO) {
    this.answers.forEach((item: IAnswerDTO, index: number, array: IAnswerDTO[]) => {
      if ((item.id !== 0 && item.id === answer.id) || (item.id === 0 && item.dateCreated && item.dateCreated === answer.dateCreated)) {
        this.answerForm.removeControl(`answer${answer.id !== 0 ? answer.id : answer.dateCreated}`);
        this.answerForm.removeControl(`weight${answer.id !== 0 ? answer.id : answer.dateCreated}`);
        array.splice(index, 1);
        this.answerForm.markAsDirty();
      }
    });
  }

  /**
   * Изменение опроса
   * @returns {Promise<void>}
   */
  async editSurvey() {
    console.log('headerdata', this.headerData);
    if (!this.headerData.image) {
      delete this.headerData.image;
    }
    if (this.headerData.background_color === '') {
      delete this.headerData.background_color;
    }
    if (this.headerData.text_content === '') {
      delete this.headerData.text_content;
    }
    if (!this.headerData.url || this.headerData.url === '') {
      delete this.headerData.url;
    }
    if (!this.footerData.image) {
      delete this.footerData.image;
    }
    if (this.footerData.background_color === '') {
      delete this.footerData.background_color;
    }
    if (this.footerData.text_content === '') {
      delete this.footerData.text_content;
    }
    if (!this.footerData.url || this.footerData.url === '') {
      delete this.footerData.url;
    }
    console.log(this.headerData);
    this.surveyData.restaurants_ids = this.restaurantIds;
    this.headerData.image = this.headerImage;
    this.footerData.image = this.footerImage;
    console.log(this.headerData);
    await this.surveysService.editSurvey(
      this.surveyData,
      this.surveysService.selectedSurvey().header.toDTO(),
      this.surveysService.selectedSurvey().footer.toDTO()
    ).then(() => {
      this.closeEditSurveyDialog();
      this.message['success']('Опрос изменен');
    });
  }

  async setSurveyStatus(isActive: boolean) {
    await this.surveysService.setSurveyStatus(this.surveysService.selectedSurvey().id, isActive)
      .then(() => {
        this.message['success'](isActive === true ? 'Опрос запущен' : 'Опрос остановлен');
      });
  }

  /**
   * Добавление вопроса
   * @returns {Promise<void>}
   */
  async addQuestion() {
    console.log(this.questionForm);
    console.log(this.answerForm);
    await this.surveysService.addQuestion(
      this.questionData,
      this.questionFormData,
      this.answers,
      this.questionFormData.type === 'mark' ? this.rangeData : null
    ).then(() => {
        this.closeAddQuestionDialog();
        this.message['success']('Вопрос добавлен');
      });
  }

  /**
   * Изменение вопроса
   * @returns {Promise<void>}
   */
  async editQuestion() {
    await this.surveysService.editQuestion(
      this.questionData,
      this.questionFormData,
      this.answers,
      this.questionFormData.type === 'mark' ? this.rangeData : null)
      .then(() => {
        this.closeEditQuestionDialog();
        this.message['success']('Вопрос изменен');
      });
  }

  /**
   * Удаление вопроса
   * @returns {Promise<void>}
   */
  async deleteQuestion() {
    await this.surveysService.deleteQuestion(this.selectedQuestion.id)
      .then(() => {
        this.closeDeleteQuestionDialog();
        this.message['success']('Вопрос удален');
      });
  }

  /**
   * Генерация кодов опроса
   * @returns {Promise<void>}
   */
  async generateCodes() {
    await this.surveysService.generateCodes(this.surveysService.selectedSurvey().id, this.codesAmount)
      .then(() => {
        this.closeGenerateCodesDialog();
        this.message['success']('Коды сгенерированы');
      });
  }

  appendHeaderImage(f: File) {
    console.log(f);
    this.headerImage = f;
    this.headerData.image = f;
    this.surveyForm.markAsDirty();
    this.surveysService.selectedSurvey().header.image = f;
  }

  appendFooterImage(f: File) {
    console.log(f);
    this.footerImage = f;
    this.footerData.image = f;
    this.surveyForm.markAsDirty();
  }

  openReport() {
    this.router.navigate(['surveys', this.surveysService.selectedSurvey().id, 'report']);
  }

  async downloadCodes() {
    const data = await this.surveysService.downloadSurveyCodes(this.surveysService.selectedSurvey().id);
    //saveAs(data, 'codes.csv');

    const file = new File([data], 'codes.csv', {type: 'text/csv;charset=utf-8'});
    saveAs(file);
    /*
    this.surveysService.downloadCodes()
      .subscribe((result: any) => {
        saveAs(result, `codes.csv`);
      });
      */
  }
}
