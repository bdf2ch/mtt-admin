import { Component, OnInit } from '@angular/core';
import { SurveysService } from '../../services/surveys.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IReportFiltersDTO } from '../../dto/report-filters.dto';
import { RestaurantsService } from '../../../restaurants/services/restaurants.service';
import { SurveyResult } from '../../models/survey-result.model';
import { ElMessageService } from 'element-angular/release/message/message.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  public isInSendEmailMode: boolean;
  public selectedTabIndex: number;
  public filterForm: FormGroup;
  public filterData: IReportFiltersDTO;
  public emailForm: FormGroup;
  public email: string;
  public questionFormType: string;
  public currentPage: number;

  constructor(private readonly formBuilder: FormBuilder,
              public readonly surveysService: SurveysService,
              public readonly restaurantsService: RestaurantsService,
              private readonly message: ElMessageService) {
    this.isInSendEmailMode = false;
    this.selectedTabIndex = 1;
    this.questionFormType = '';
    this.currentPage = 1;
    this.email = null;
    this.filterData = {
      date_from: null,
      date_to: null,
      restaurants_ids: [],
      questions_ids: [],
      page: this.currentPage
    };
  }



  single: any[] = [
    {
      name: 'Germany',
      value: 40
    },
    {
      name: 'USA',
      value: 49
    },
    {
      name: 'France',
      value: 36
    },
    {
      name: 'United Kingdom',
      value: 36
    },
    {
      name: 'Spain',
      value: 33
    },
    {
      name: 'Italy',
      value: 35
    }
  ];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  tooltipDisabled = false;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'GDP Per Capita';
  showGridLines = true;
  innerPadding = 0;
  barPadding = 8;
  groupPadding = 16;
  roundDomains = false;
  maxRadius = 10;
  minRadius = 3;

  colorScheme = {
    domain: [
      '#0099cc', '#2ECC71', '#4cc3d9', '#ffc65d', '#d96557', '#ba68c8'
    ]
  };
  schemeType = 'ordinal';

  // pie
  showLabels = true;
  explodeSlices = false;
  doughnut = false;
  arcWidth = 0.25;

  ngOnInit() {
    const dateRegExp = /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/;
    this.filterForm = this.formBuilder.group({
      start: [this.filterData.date_from, Validators.pattern(dateRegExp)],
      end: [this.filterData.date_to, Validators.pattern(dateRegExp)]
    });
    this.emailForm = this.formBuilder.group({
      email: [this.email, [Validators.required, Validators.email]]
    });
  }


  select(data) {
    console.log('Item clicked', data);
  }

  onLegendLabelClick(entry) {
    console.log('Legend clicked', entry);
  }






  /**
   * Получение статуса элемента формы фильтров
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  filterFormStatusCtrl(item: string): string {
    if (!this.filterForm.controls[item]) { return; }
    const control: AbstractControl = this.filterForm.controls[item];
    return control.dirty && control.hasError('pattern') ? 'error' : 'validating';
  }

  /**
   * Получение сообщения об ошибке элемента формы фильтров
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  filterFormMessageCtrl(item: string): string {
    if (!this.filterForm.controls[item]) { return; }
    const control: AbstractControl = this.filterForm.controls[item];
    switch (item) {
      case 'start':
        return control.dirty && control.hasError('pattern') ? 'Дата должна быть в формате ГГГГ-ММ-ДД' : '';
      case 'end':
        return control.dirty && control.hasError('pattern') ? 'Дата должна быть в формате ГГГГ-ММ-ДД' : '';
      default:
        return '';
    }
  }

  /**
   * Получение статуса элемента формы отправки почты
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  emailFormStatusCtrl(item: string): string {
    if (!this.emailForm.controls[item]) { return; }
    const control: AbstractControl = this.emailForm.controls[item];
    return control.dirty && control.hasError('required') || control.hasError('email') ? 'error' : 'validating';
  }

  /**
   * Получение сообщения об ошибке элемента формы отправки почты
   * @param {string} item - Имя элемента формы
   * @returns {string}
   */
  emailFormMessageCtrl(item: string): string {
    if (!this.emailForm.controls[item]) { return; }
    const control: AbstractControl = this.emailForm.controls[item];
    switch (item) {
      case 'email':
        return control.dirty && control.hasError('required')
          ? 'Вы не указали E-mail' : control.hasError('email')
            ? 'E-mail указан некорректно' : '';
    }
  }

  selectTab(index: number) {
    this.selectedTabIndex = index;
    switch (index) {
      case 1:
        this.questionFormType = '';
        break;
      case 2:
        this.questionFormType = 'mark';
        break;
      case 3:
        this.questionFormType = 'text_input';
        break;
    }
  }

  changeRestaurant(value: any) {
    console.log(value);
    this.filterData.restaurants_ids = value;
    console.log(this.filterData);
  }

  changeQuestion(value: any) {
    console.log(value);
    this.filterData.questions_ids = value;
    console.log(this.filterData);
  }

  async getReport() {
    const data: IReportFiltersDTO = {
      date_from: this.filterData.date_from,
      date_to: this.filterData.date_to,
      restaurants_ids: this.filterData.restaurants_ids,
      questions_ids: this.filterData.questions_ids
    };
    if (!data.date_from) {
      delete data.date_from;
    }
    if (!data.date_to) {
      delete data.date_to;
    }
    if (data.restaurants_ids.length === 0) {
      delete data.restaurants_ids;
    }
    if (data.questions_ids.length === 0) {
      delete data.questions_ids;
    }
    switch (this.selectedTabIndex) {
      case 1:
        await this.surveysService.fetchCommonReport(this.surveysService.selectedSurvey().id, data);
        break;
      case 2:
        await this.surveysService.fetchCompareReport(this.surveysService.selectedSurvey().id, data);
        break;
      case 3:
        await this.surveysService.fetchSurveyResults(this.surveysService.selectedSurvey().id, data);
        break;
    }
  }


  /**
   * Выбор прохождения опроса
   * @param {SurveyResult} result - Прохождение опроса
   */
  async selectSurveyResult(result: SurveyResult) {
    this.surveysService.selectedResult(result);
    if (!result.viewed) {
      await this.surveysService.setSurveyResultViewStatus(result.id, true);
    }
  }


  /**
   * Открытие диалогового окна отправки результатов опроса на почту
   */
  openSendToEmailDialog() {
    this.isInSendEmailMode = true;
  }

  /**
   * Закрытие диалогового окна отправки результатов опроса на почту
   */
  closeSendToEmailDialog() {
    this.isInSendEmailMode = false;
  }

  /**
   * Отправка рехультатов опроса на почту
   * @returns {Promise<void>}
   */
  async sendSurveyResultToEmail() {
    await this.surveysService.sendSurveyResultToEmail(this.surveysService.selectedSurvey().id, this.email)
      .then(() => {
        this.closeSendToEmailDialog();
        this.message['success']('Отзывы отправлены на указанную почту');
      });
  }

  async markResultAsNotViewed(result: SurveyResult) {
    await this.surveysService.setSurveyResultViewStatus(result.id, false)
      .then( () => {
        this.surveysService.selectedResult(null);
        console.log(this.surveysService.selectedResult());
      });
  }

  /**
   * Изменение стариницы отображения отзывов
   * @param {number} page - Страница
   */
  async changePage(page: number) {
    console.log('page', page);
    console.log(this.filterData);
    this.filterData.page = this.currentPage;
    await this.surveysService.fetchSurveyResults(this.surveysService.selectedSurvey().id, this.filterData);
  }
}
