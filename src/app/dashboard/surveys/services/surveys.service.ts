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
import {IQuestionFormDTO} from '../dto/question-form.dto';
import {QuestionForm} from '../models/question-form.model';
import {Answer} from '../models/answer.model';
import {IAnswerDTO} from '../dto/answer.dto';
import {IRangeDTO} from '../dto/range.dto';
import {QuestionRange} from '../models/question-range.model';
import {IQuestionFormType} from '../interfaces/question-form-type.interface';

@Injectable({
  providedIn: 'root'
})
export class SurveysService {
  private questionTypes: QuestionType[];
  private surveys: Survey[];
  private selectedSurvey_: Survey | null;
  private isAddingSurveyInProgress: boolean;
  private isEditingSurveyInProgress: boolean;
  private isDeletingSurveyInProgress: boolean;
  private isSettingSurveyStatusInProgress: boolean;
  private isAddingQuestionInProgress: boolean;
  private isEditingQuestionInProgress: boolean;
  private isDeletingQuestionInProgress: boolean;

  constructor(private readonly resource: SurveysResource) {
    this.questionTypes = [];
    this.surveys = [];
    this.selectedSurvey_ = null;
    this.isAddingSurveyInProgress = false;
    this.isEditingSurveyInProgress = false;
    this.isSettingSurveyStatusInProgress = false;
    this.isDeletingSurveyInProgress = false;
    this.isAddingQuestionInProgress = false;
    this.isEditingQuestionInProgress = false;
    this.isDeletingQuestionInProgress = false;
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
}
