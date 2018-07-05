import { Component, OnInit } from '@angular/core';
import { SurveysService } from '../../services/surveys.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Restaurant } from '../../../restaurants/models/restaurant.model';
import { IReportFiltersDTO } from '../../dto/report-filters.dto';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  public selectedTabIndex: number;
  public filterForm: FormGroup;
  public filterData: IReportFiltersDTO;

  constructor(private readonly formBuilder: FormBuilder,
              public readonly surveysService: SurveysService) {
    this.selectedTabIndex = 1;
    this.filterData = {
      date_from: null,
      date_to: null,
      restaurants_ids: []
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

  selectTab(index: number) {
    this.selectedTabIndex = index;
  }

  changeRestaurant(value: boolean, restaurant: Restaurant) {
    if (value === false) {
      this.filterData.restaurants_ids.forEach((item: number, index: number, array: number[]) => {
        if (item === restaurant.id) {
          array.splice(index, 1);
        }
      });
    } else {
      this.filterData.restaurants_ids.push(restaurant.id);
    }
    console.log(this.filterData);
  }

  async getReport() {
    const data: IReportFiltersDTO = {
      date_from: this.filterData.date_from,
      date_to: this.filterData.date_to,
      restaurants_ids: this.filterData.restaurants_ids
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
    await this.surveysService.fetchCommonReport(this.surveysService.selectedSurvey().id, data);
  }

}
