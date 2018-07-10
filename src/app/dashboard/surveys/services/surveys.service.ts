import { Injectable } from '@angular/core';
import { Survey } from '../models/survey.model';
import { SurveysResource } from '../resources/surveys.resource';
import { ISurveyDTO } from '../dto/survey.dto';
import { IRestaurantDTO } from '../../restaurants/dto/restaurant.dto';
import { Restaurant } from '../../restaurants/models/restaurant.model';
import { QuestionType } from '../models/question-type.model';
import { QuestionFormType } from '../models/question-form-type.model';
import { Question } from '../models/question.model';
import { IQuestionDTO } from '../dto/question.dto';
import { IQuestionFormDTO } from '../dto/question-form.dto';
import { QuestionForm } from '../models/question-form.model';
import { Answer } from '../models/answer.model';
import { IAnswerDTO } from '../dto/answer.dto';
import { IRangeDTO } from '../dto/range.dto';
import { QuestionRange } from '../models/question-range.model';
import { IQuestionFormType } from '../interfaces/question-form-type.interface';
import { ITemplateDTO } from '../dto/template.dto';
import { Template } from '../models/template.model';
import { Code } from '../models/code.model';
import { ICodeDTO } from '../dto/code.dto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Report } from '../models/report.model';
import { IReportFiltersDTO } from '../dto/report-filters.dto';
import { ComparsionReport } from '../models/comparsion-report.model';
import { SurveyResult } from '../models/survey-result.model';
import { ISurveyResultDTO } from '../dto/survey-result.dto';
import {Observable} from 'rxjs';
import 'rxjs/operators/map';
import {map} from 'rxjs/operators';
import {IServerResponse} from '../../../shared/interfaces/server-response.interface';

@Injectable({
  providedIn: 'root'
})
export class SurveysService {
  private questionTypes: QuestionType[];
  private surveys: Survey[];
  private templates: Survey[];
  private selectedSurvey_: Survey | null;
  private selectedSurveyCodes: Code[];
  private isAddingSurveyInProgress: boolean;
  private isEditingSurveyInProgress: boolean;
  private isDeletingSurveyInProgress: boolean;
  private isSettingSurveyStatusInProgress: boolean;
  private isAddingQuestionInProgress: boolean;
  private isEditingQuestionInProgress: boolean;
  private isDeletingQuestionInProgress: boolean;
  private isGeneratingCodesInProgress: boolean;
  private isSendingEmailInProgress: boolean;
  private isSettingResultStatusInProgress: boolean;
  private commonReport: Report | null;
  private comparsionReport: Report | null;
  private feedbackReport: SurveyResult[];
  private selectedSurveyResult: SurveyResult | null;
  public feedbackTotal: number;

  constructor(private readonly resource: SurveysResource,
              private readonly http: HttpClient) {
    this.questionTypes = [];
    this.surveys = [];
    this.templates = [];
    this.selectedSurvey_ = null;
    this.selectedSurveyCodes = [];
    this.isAddingSurveyInProgress = false;
    this.isEditingSurveyInProgress = false;
    this.isSettingSurveyStatusInProgress = false;
    this.isDeletingSurveyInProgress = false;
    this.isAddingQuestionInProgress = false;
    this.isEditingQuestionInProgress = false;
    this.isDeletingQuestionInProgress = false;
    this.isGeneratingCodesInProgress = false;
    this.isSendingEmailInProgress = false;
    this.isSettingResultStatusInProgress = false;
    this.commonReport = null;
    this.comparsionReport = null;
    this.feedbackReport = [];
    this.selectedSurveyResult = null;
    this.feedbackTotal = 0;
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
   * Получение списка опросов, являющихся шаблонами
   * @returns {Promise<Survey[]>}
   */
  async fetchSurveyTemplatesList(): Promise<Survey[]> {
    try {
      const result = await this.resource.getSurveyTemplates();
      if (result.data) {
        result.data.forEach((item: ISurveyDTO) => {
          const survey = new Survey(item);
          this.templates.push(survey);
        });
        console.log('templates', this.templates);
        return this.templates;
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Получение списка типов вопроса и типов форм вопросов
   * @returns {Promise<QuestionType[]>}
   */
  async fetchQuestionTypes(): Promise<QuestionType[]> {
    try {
      const result = await this.resource.getQuestionTypes();
      if (result.data) {
        for (const question_type in result.data) {
          const questionType = new QuestionType({code: question_type, title: result.data[question_type]['display_name']});
          for (const form in result.data[question_type]['available_forms']) {
            const questionFormType = new QuestionFormType({code: form, title: result.data[question_type]['available_forms'][form]});
            questionType.forms.push(questionFormType);
          }
          this.questionTypes.push(questionType);
        }
        console.log(this.questionTypes);
        return this.questionTypes;
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
   * Получение списка опроов, являющихся шаблонами
   * @returns {Survey[]}
   */
  getSurveysTemplatesList(): Survey[] {
    return this.templates;
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
   * Воз вращает список типов вопросов
   * @returns {QuestionType[]}
   */
  getQuestionTypesList(): QuestionType[] {
    return this.questionTypes;
  }

  /**
   * Поиск типа вопроса по коду
   * @param {string} code - Код типа вопроса
   * @returns {QuestionType | null}
   */
  getQuestionTypeByCode(code: string): QuestionType | null {
    const findQuestionTypeByCode = (type: QuestionType) => type.code === code;
    const questionType = this.questionTypes.find(findQuestionTypeByCode);
    return questionType ? questionType : null;
  }

  /**
   * Поиск типа формы вопроса коду
   * @param {string} code - Код формы вопроса
   * @returns {IQuestionFormType | null}
   */
  getFormTypeByCode(code: string): IQuestionFormType | null {
    let result = null;
    const findQuestionFormTypeByCode = (type: QuestionType) => type.code === code;
    this.questionTypes.forEach((questionType: QuestionType) => {
      const formType = questionType.forms.find(findQuestionFormTypeByCode);
      if (formType) {
        result = formType;
      }
    });
    return result;
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
   * Выполняется ли активация / деактивация опроса
   * @returns {boolean}
   */
  settingSurveyStatusInProgress(): boolean {
    return this.isSettingSurveyStatusInProgress;
  }

  /**
   * Выполняется ли удалени опроса
   * @returns {boolean}
   */
  deletingSurveyInProgress(): boolean {
    return this.isDeletingSurveyInProgress;
  }

  /**
   * Выполняется ли добавление вопроса
   * @returns {boolean}
   */
  addingQuestionInProgress(): boolean {
    return this.isAddingQuestionInProgress;
  }

  /**
   * Выполняется ли изменение вопроса
   * @returns {boolean}
   */
  editingQuestionInProgress(): boolean {
    return this.isEditingQuestionInProgress;
  }

  /**
   * Выполняется ли удаление вопроса
   * @returns {boolean}
   */
  deletingQuestionInProgress(): boolean {
    return this.isDeletingQuestionInProgress;
  }

  /**
   * Выполняется ли генерация кодов опроса
   * @returns {boolean}
   */
  generatingCodesInProgress(): boolean {
    return this.isGeneratingCodesInProgress;
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
  async editSurvey(survey: ISurveyDTO, header: ITemplateDTO, footer: ITemplateDTO): Promise<Survey | null> {
    console.log('header', header);
    try {
      this.isEditingSurveyInProgress = true;
      const result = await this.resource.editSurvey(survey, null, {surveyId: survey.id});
      if (result.data) {
        this.isEditingSurveyInProgress = false;
        this.surveys.forEach(async (item: Survey) => {
          if (item.id === survey.id) {
            item.title = survey.name;
            item.description = survey.description;
            item.start = new Date(survey.from);
            item.end = survey.to ? new Date(survey.to) : null;
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

            await this.editTemplate_(new Template(header), header.id)
              .subscribe((data: Template) => {
                console.log('HEADER', data);
                this.selectedSurvey().header = data;
              });

            await this.editTemplate_(new Template(footer), footer.id)
              .subscribe((data: Template) => {
                console.log('FOOTER', data);
                this.selectedSurvey().footer = data;
              });

           // await this.editTemplate(new Template(footer), survey.id);
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

  /**
   * Удаление опроса
   * @param {number} surveyId - Идентификатор опроса
   * @returns {Promise<boolean>}
   */
  async deleteSurvey(surveyId: number): Promise<boolean> {
    try {
      this.isDeletingSurveyInProgress = true;
      const result = await this.resource.deleteSurvey({surveyId: surveyId});
      if (result.meta['success'] && result.meta['success'] === true) {
        this.isDeletingSurveyInProgress = false;
        let answer = false;
        this.surveys.forEach((survey: Survey, index: number, array: Survey[]) => {
          array.splice(index, 1);
          answer = true;
        });
        return answer;
      }
    } catch (error) {
      console.error(error);
      this.isDeletingSurveyInProgress = false;
      return false;
    }
  }

  /**
   * Активация / деактивация опроса
   * @param {number} surveyId - Идентификатор опроса
   * @param {boolean} isActive - Статус опроса
   * @returns {Promise<boolean>}
   */
  async setSurveyStatus(surveyId: number, isActive: boolean): Promise<boolean> {
    try {
      this.isSettingSurveyStatusInProgress = true;
      const result = await this.resource.setSurveyStatus({is_active: isActive === true ? 1 : 0}, null, {surveyId: surveyId});
      if (result.data) {
        this.isSettingSurveyStatusInProgress = false;
        const findSurveyById = (item: Survey) => item.id === surveyId;
        const survey = this.surveys.find(findSurveyById);
        if (survey) {
          console.log(survey);
          survey.isActive = isActive;
          console.log(survey);
        }
        return true;
      }
    } catch (error) {
      console.error(error);
      this.isSettingSurveyStatusInProgress = false;
      return false;
    }
  }

  /**
   * Добавление информации о вопросе
   * @param {IQuestionDTO} question - Вопрос
   * @returns {Promise<Question | null>}
   */
  async addQuestionInfo(question: IQuestionDTO): Promise<Question | null> {
    try {
      const result = await this.resource.addQuestion(question);
      if (result.data) {
        const question_ = new Question(result.data);
        return question_;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Изменение информации о вопросе
   * @param {IQuestionDTO} question - Вопрос
   * @returns {Promise<Question | null>}
   */
  async editQuestionInfo(question: IQuestionDTO): Promise<Question | null> {
    try {
      this.isEditingQuestionInProgress = true;
      const result = await this.resource.editQuestion(question, null, {questionId: question.id});
      if (result.data) {
        this.isEditingQuestionInProgress = false;
        let res = null;
        this.selectedSurvey_.questions.forEach((question_: Question) => {
          if (question_.id === question.id) {
            console.log('question found');
            question_.title = question.title;
            question_.type = question.type;
            question_.weight = question.weight;
            res = question_;
          }
        });
        return res;
      }
    } catch (error) {
      console.error(error);
      this.isEditingQuestionInProgress = false;
      return null;
    }
  }

  /**
   * Добавление формы вопроса
   * @param {IQuestionFormDTO} form - Форма вопроса
   * @returns {Promise<QuestionForm | null>}
   */
  async addQuestionForm(form: IQuestionFormDTO): Promise<QuestionForm | null> {
    try {
      const result = await this.resource.addQuestionForm(form);
      if (result.data) {
        const form_ = new QuestionForm(result.data);
        return form_;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Изменение формы вопроса
   * @param {IQuestionFormDTO} form - Форма вопроса
   * @returns {Promise<QuestionForm | null>}
   */
  async editQuestionForm(form: IQuestionFormDTO): Promise<QuestionForm | null> {
    try {
      const result = await this.resource.editQuestionForm(form, null, {questionFormId: form.id});
      if (result.data) {
        const form_ = new QuestionForm(result.data);
        return form_;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Добавление ответа
   * @param {IAnswerDTO} answer - Ответ
   * @param {number} questionFormId - Идентификатор формы вопроса
   * @returns {Promise<Answer | null>}
   */
  async addAnswer(answer: IAnswerDTO, questionFormId: number): Promise<Answer | null> {
    try {
      const result = await this.resource.addAnswer(answer, null, {questionFormId: questionFormId});
      if (result.data) {
        const answer_ = new Answer(result.data);
        return answer_;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Изменение ответа
   * @param {IAnswerDTO} answer - Ответ
   * @param {number} questionId - Идентификатор вопроса
   * @returns {Promise<Answer | null>}
   */
  async editAnswer(answer: IAnswerDTO, questionId: number): Promise<Answer | null> {
    try {
      const result = await this.resource.editAnswer(answer, null, {answerId: answer.id});
      if (result.data) {
        const findQuestionById = (item: Question) => item.id === questionId;
        const question = this.selectedSurvey_.questions.find(findQuestionById);
        if (question) {
          question.answers.forEach((answer_: Answer) => {
            if (answer_.id === answer.id) {
              answer_.content = answer.text_content;
              answer_.weight = answer.weight;
              answer_.index = answer.index;
              return answer;
            }
          });
        }
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Удаление ответа
   * @param {number} answerId - Идентфиикатор ответа
   * @param {number} questionId - Идентфиикатор вопроса
   * @returns {Promise<boolean>}
   */
  async deleteAnswer(answerId: number, questionId: number): Promise<boolean> {
    try {
      const result = await this.resource.deleteAnswer({answerId: answerId});
      if (result.meta['success'] && result.meta['success'] === true) {
        const findQuestionById = (question: Question) => question.id === questionId;
        const question_ = this.selectedSurvey_.questions.find(findQuestionById);
        if (question_) {
          question_.answers.forEach((answer: Answer, index: number, array: Answer[]) => {
            if (answer.id === answerId) {
              array.splice(index, 1);
              return true;
            }
          });
        }
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * Добавление диапазона
   * @param {IRangeDTO} range - Диапазон
   * @param {number} questionFormId - Идентификато рформы вопроса
   * @returns {Promise<QuestionRange | null>}
   */
  async addRange(range: IRangeDTO, questionFormId: number): Promise<QuestionRange | null> {
    try {
      const result = await this.resource.addRange(range, null, {questionFormId: questionFormId});
      if (result.data) {
        const range_  = new QuestionRange(result.data);
        return range_;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Изменение диапазона
   * @param {IRangeDTO} range - Диапазон
   * @returns {Promise<QuestionRange | null>}
   */
  async editRange(range: IRangeDTO): Promise<QuestionRange | null> {
    try {
      const result = await this.resource.editRange(range, null, {rangeId: range.id});
      if (result.data) {
        const range_ = new QuestionRange(result.data);
        return range_;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Добавление вопроса к опросу
   * @param {number} questionId - Идентификатор вопроса
   * @param {number} surveyId - Идентификатор опроса
   * @param {number} index - Порядковый номер вопроса
   * @returns {Promise<boolean>}
   */
  async addQuestionToSurvey(questionId: number, surveyId: number, index?: number): Promise<boolean> {
    try {
      const result = await this.resource.addQuestionToSurvey({prev_question_id: index ? index : undefined}, null, {questionId: questionId, surveyId: surveyId});
      if (result.data) {
        return true;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * Добавление вопроса
   * @param {IQuestionDTO} question - Вопрос
   * @param {IQuestionFormDTO} form - Форма вопроса
   * @param {IAnswerDTO[]} answers - Массив ответов
   * @param {IRangeDTO | null} range - Диапозон
   * @returns {Promise<Question | null>}
   */
  async addQuestion(question: IQuestionDTO, form: IQuestionFormDTO, answers: IAnswerDTO[], range: IRangeDTO | null): Promise<Question | null> {
    try {
      this.isAddingQuestionInProgress = true;
      const question_ = await this.addQuestionInfo(question);
      if (question_) {
        form.question_id = question_.id;
        const form_ = await this.addQuestionForm(form);
        if (form_) {
          question_.form = form_;
          if (answers.length > 0) {
            answers.forEach(async (item: IAnswerDTO) => {
              const answer_ = await this.addAnswer(item, form_.id);
              if (answer_) {
                question_.answers.push(answer_);
              }
            });
          } else if (range) {
            const range_ = await this.addRange(range, form_.id);
            if (range_) {
              question_.range = range_;
            }
          }
          const attach = await this.addQuestionToSurvey(question_.id, this.selectedSurvey_.id);
          if (attach) {
            this.isAddingQuestionInProgress = false;
            if (this.selectedSurvey_) {
              this.selectedSurvey_.questions.push(question_);
            }
          }
          return question_;
        }
      }
      return null;
    } catch (error) {
      console.error(error);
      this.isAddingQuestionInProgress = false;
      return null;
    }
  }

  /**
   * Измененение вопроса
   * @param {IQuestionDTO} question - Вопрос
   * @param {IQuestionFormDTO} form - Форма вопроса
   * @param {IAnswerDTO[]} answers - Массив ответов
   * @param {IRangeDTO | null} range - Диапазон
   * @returns {Promise<Question | null>}
   */
  async editQuestion(question: IQuestionDTO, form: IQuestionFormDTO, answers: IAnswerDTO[], range: IRangeDTO | null): Promise<Question | null> {
    try {
      this.isEditingQuestionInProgress = true;
      const question_ = await this.editQuestionInfo(question);
      console.log('question', question_);
      if (question_) {
       if (question_.form.type !== form.type) {
         const form_ = await this.editQuestionForm(form);
         if (form_) {
           question_.form = form_;
           question_.answers = [];
           if (range) {
             const range_ = await this.addRange(range, form_.id);
             if (range_) {
               question_.range = range_;
               return question_;
             }
           }
           answers.forEach(async (item: IAnswerDTO) => {
             const answer_ = await this.addAnswer(item, form_.id);
             if (answer_) {
               question_.answers.push(answer_);
             }
           });
         }
       } else {
         if (range) {
           const range_ = await this.editRange(range);
           if (range_) {
             question_.range = range_;
             return question_;
           }
         }

         answers.forEach(async (item: IAnswerDTO) => {
           const findAnswerById = (answer: Answer) => answer.id === item.id;
           const answer_ = question_.answers.find(findAnswerById);
           if (answer_) {
             if (answer_.index !== item.index || answer_.content !== item.text_content || answer_.weight !== item.weight) {
               const editedAnswer = await this.editAnswer(item, question_.id);
             }
           } else {
             const newAnswer = await this.addAnswer(item, form.id);
             if (newAnswer) {
               question_.answers.push(newAnswer);
             }
           }
         });

         question_.answers.forEach(async (item: Answer) => {
           const findAnswerById = (answer: IAnswerDTO) => answer.id === item.id;
           const answer_ = answers.find(findAnswerById);
           console.log('founded answer', answer_);
           if (!answer_) {
              const deleteResult = await this.deleteAnswer(item.id, question_.id);
           }
         });
       }
       this.isEditingQuestionInProgress = false;
       return question_;
      }
    } catch (error) {
      console.error(error);
      this.isEditingQuestionInProgress = false;
      return null;
    }
  }

  /**
   * Удаление вопроса
   * @param {number} questionId - Идентификатор вопроса
   * @returns {Promise<boolean>}
   */
  async deleteQuestion(questionId: number): Promise<boolean> {
    try {
      this.isDeletingQuestionInProgress = true;
      const result = await this.resource.deleteQuestion({questionId: questionId});
      if (result.meta['success'] && result.meta['success'] === true) {
        this.isDeletingQuestionInProgress = false;
        this.selectedSurvey_.questions.forEach((question: Question, index: number, array: Question[]) => {
          if (question.id === questionId) {
            array.splice(index, 1);
            return true;
          }
        });
      }
    } catch (error) {
      console.error(error);
      this.isDeletingQuestionInProgress = false;
      return false;
    }
  }

  /**
   * Получение кодов опроса с сервера
   * @param {number} surveyId - Идентфиикатор опроса
   * @returns {Promise<Code[] | null>}
   */
  async fetchSurveyCodes(surveyId: number): Promise<Code[] | null> {
    try {
      const result = await this.resource.getSurveyCodes(null, null, {surveyId: surveyId});
      if (result.data) {
        this.selectedSurveyCodes = [];
        result.data.forEach((item: ICodeDTO) => {
          const code = new Code(item);
          this.selectedSurveyCodes.
            push(code);
        });
        console.log(this.selectedSurveyCodes);
        return this.selectedSurveyCodes;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Загрузка файла с кодами прохождения опроса
   * @param {number} surveyId - Идентификатор опроса
   * @returns {Promise<any>}
   */
  async downloadSurveyCodes(surveyId: number): Promise<any> {
    try {
      const result = await this.resource.downloadSurveyCodes(null, null, {surveyId: surveyId});
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  downloadCodes() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + (window.localStorage && window.localStorage.getItem('api_token') ? window.localStorage.getItem('api_token') : ''),
      'Content-Type': 'text/csv',
      'Accept': 'text/csv'
      });
    return this.http.get(
      environment.apiUrl + `questionnaire/${this.selectedSurvey_.id}/questionnaire-code/csv`,
      {
        headers: headers,
        responseType: 'blob'
      });
  }

  /**
   * Генерация кодов опроса
   * @param {number} surveyId - Идентификатор опроса
   * @param {number} amount - Количество кодов
   * @returns {Promise<boolean>}
   */
  async generateCodes(surveyId: number, amount: number): Promise<Code[] | null> {
    try {
      this.isGeneratingCodesInProgress = true;
      const result = await this.resource.generateCodes({count: amount}, null, {surveyId: surveyId});
      if (result.data) {
        this.isGeneratingCodesInProgress = false;
        result.data.forEach((item: ICodeDTO) => {
          const code = new Code(item);
          this.selectedSurveyCodes.push(code);
        });
        const findSurveyById = (survey: Survey) => survey.id === surveyId;
        const survey_ = this.surveys.find(findSurveyById);
        if (survey_) {
          survey_.passingCount += Number(amount);
        }
        return this.selectedSurveyCodes;
      }
    } catch (error) {
      console.error(error);
      this.isGeneratingCodesInProgress = false;
      return null;
    }
  }

  getCodes(): Code[] {
    return this.selectedSurveyCodes;
  }

  /**
   * Добавление шапки опроса
   * @param {ITemplateDTO} header - Шапка
   * @param {number} surveyId - Идентфикатор опроса
   * @returns {Promise<ITemplateDTO | null>}
   */
  async addHeader(header: ITemplateDTO, surveyId: number): Promise<Template | null> {
    try {
      const result = await this.resource.addHeader(header, null, null);
      if (result.data) {
        const header_ = new Template(result.data);
        const findSurveyById = (item: Survey) => item.id === surveyId;
        const survey = this.surveys.find(findSurveyById);
        if (survey) {
          survey.header = header_;
        }
        return header_;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async editTemplate(template: Template, surveyId: number): Promise<Template | null> {
    try {
      console.log(template);
      const result = await this.resource.editHeader(template.toDTO(), null, {templateId: template.id});
      if (result.data) {
        const findSurveyById = (item: Survey) => item.id === surveyId;
        const survey = this.surveys.find(findSurveyById);
        if (survey) {
          if (template.type === 'header') {
            survey.header = new Template(result.data);
            // survey.header.url = template.url;
            // survey.header.content = template.text_content;
            // survey.header.backgroundColor = template.background_color;
            // survey.header.imageUrl = result.data.image_url;
          }
          if (template.type === 'footer') {
            survey.footer = new Template(result.data);
            // survey.footer.url = template.url;
            // survey.footer.content = template.text_content;
            // survey.footer.backgroundColor = template.background_color;
            // survey.footer.imageUrl = result.data.image_url;
          }
          return template.type === 'template' ? survey.header : survey.footer;
        }
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  editTemplate_(template: Template, templateId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': window.localStorage && window.localStorage['api_token'] ? `Bearer ${window.localStorage['api_token']}` : '',
    });
    const request = this.http.post(
      environment.apiUrl + `questionnaire-template/${templateId}`,
      template.toFormData(),
      {headers: headers}
    ).pipe(map((result: IServerResponse<ITemplateDTO>) => {
      const tpl = new Template(result.data);
      console.log('recieved template', tpl);
      return tpl;
    }));
    return request;
  }


  /**
   * Получение отчета с общей оценкой с сервера
   * @param {number} surveyId - Идентификатор опроса
   * @param {IReportFiltersDTO} filters - Фильтры
   * @returns {Promise<Report | null>}
   */
  async fetchCommonReport(surveyId: number, filters?: IReportFiltersDTO, ): Promise<Report | null> {
    console.log('filters', filters);
    try {
      const result = await filters
        ? await this.resource.getCommonReport(null, filters, {surveyId: surveyId}) : await this.resource.getCommonReport(null, null, {surveyId: surveyId});
      if (result.data) {
        const report  = new Report(result.data);
        this.commonReport = report;
        console.log(this.commonReport);
        return this.commonReport;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Возвращает отчет с общей оценкой
   * @returns {Report | null}
   */
  getCommonReport(): Report | null {
    return this.commonReport;
  }

  /**
   * Получение сравнительного отчета с сервера
   * @param {number} surveyId - Идентфиикатор опроса
   * @param {IReportFiltersDTO} filters - Фильтры
   * @returns {Promise<Report | null>}
   */
  async fetchCompareReport(surveyId: number, filters: IReportFiltersDTO): Promise<Report | null> {
    try {
      const result = await filters
        ? await this.resource.getCompareReport(null, filters, {surveyId: surveyId}) : await this.resource.getCommonReport(null, null, {surveyId: surveyId});
      if (result.data) {
        const report  = new ComparsionReport(result.data);
        this.comparsionReport = report;
        console.log(this.comparsionReport);
        return this.comparsionReport;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Возвращает сравнительный отчет
   * @returns {Report | null}
   */
  getComparsionReport(): Report | null {
    return this.comparsionReport;
  }

  /**
   * Получение результатов опроса с сервера
   * @param {number} surveyId - Идентификатор опроса
   * @param {IReportFiltersDTO} filters - Фильтры
   * @returns {Promise<SurveyResult[] | null>}
   */
  async fetchSurveyResults(surveyId: number, filters: IReportFiltersDTO): Promise<SurveyResult[] | null> {
    try {
      const result = await filters
        ? await this.resource.getFeedbackReport(null, filters, {surveyId: surveyId}) : await this.resource.getFeedbackReport(null, null, {surveyId: surveyId});
      if (result.data) {
        this.feedbackReport = [];
        result.data.forEach((item: ISurveyResultDTO) => {
          const res = new SurveyResult(item);
          this.feedbackReport.push(res);
        });
        console.log(this.feedbackReport);
        return this.feedbackReport;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Возвращает отзывы
   * @returns {SurveyResult[]}
   */
  getFeedbackreport(): SurveyResult[] {
    return this.feedbackReport;
  }

  /**
   * Установка / получение текущего результата опроса
   * @param {SurveyResult | null} result - Результат опроса
   * @returns {SurveyResult | null}
   */
  selectedResult(result?: SurveyResult | null): SurveyResult | null {
    if (result) {
      this.selectedSurveyResult = result;
    }
    return this.selectedSurveyResult;
  }

  async sendSurveyResultToEmail(surveyId: number, email: string): Promise<boolean> {
    try {
      this.isSendingEmailInProgress = true;
      const result = await this.resource.sendSurveyResultToEmail({target_email: email}, null, {surveyId: surveyId});
      if (result.meta['success'] && result.meta['success'] === true) {
        this.isSendingEmailInProgress = false;
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      this.isSendingEmailInProgress = false;
      return false;
    }
  }

  sendingEmailInProgress(): boolean {
    return this.isSendingEmailInProgress;
  }

  async setSurveyResultViewStatus(resultId: number, status: boolean): Promise<boolean> {
    try {
      this.isSettingResultStatusInProgress = true;
      const result = await this.resource.setResultViewStatus({status: status ? 1 : 0}, null, {resultId: resultId});
      if (result.data) {
        this.isSettingResultStatusInProgress = false;
        this.feedbackReport.forEach((item: SurveyResult) => {
          if (item.id === resultId) {
            item.viewed = status;
          }
        });
        if (this.commonReport) {
          if (status) {
            this.commonReport.views.notViewed--;
          } else {
            this.commonReport.views.notViewed++;
          }
        }
        return true;
      }
    } catch (error) {
      console.error(error);
      this.isSettingResultStatusInProgress = false;
      return false;
    }
  }

  settingResultStatus(): boolean {
    return this.isSettingResultStatusInProgress;
  }
}
