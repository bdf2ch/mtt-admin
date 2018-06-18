import { ISurvey } from '../interfaces/survey.interface';
import { ISurveyDTO } from '../dto/survey.dto';

/**
 * Класс, реализующий интерфейс опроса
 */
export class Survey implements ISurvey {
  id: number;                       // Идентификатор
  companyId: number;                // Идентфиикатор компании
  rewardId: number;                 // Идентификатор вознаграждения
  title: string;                    // Наименование
  description?: string | null;      // Описание
  start: Date | null;               // Дата начала
  end?: Date | null;                // Дата окончания
  passingCount: number;             // Число возможных прохождений
  passedCount: number;              // Число завершенных прохождений
  isTemplate: boolean;              // Является ли шаблоном
  isActive: boolean;                // Является ли активным

  /**
   * Конструктор
   * @param {ISurveyDTO} config - Параметры инициализации
   */
  constructor(config?: ISurveyDTO) {
    this.id = config ? config.id : 0;
    this.companyId = config ? config.company_id : 0;
    this.rewardId = config ? config.reward_id : 0;
    this.title = config ? config.name : '';
    this.description = config && config.description ? config.description : null;
    this.start = config ? new Date(config.from) : new Date();
    this.end = config && config.to ? new Date(config.to) : null;
    this.passingCount = config ? config.available_passing_count : 0;
    this.passedCount = config ? config.passed_count : 0;
    this.isTemplate = config ? config.is_template : false;
    this.isActive = config ? config.is_active : false;
  }
}
