import { IReward } from '../interfaces/reward.interface';
import { IRewardDTO } from '../dto/reward.dto';

/**
 * Класс, реализующий интерфейс вознаграждения
 */
export class Reward implements IReward {
  id: number;               // Идентификатор
  companyId: number;        // Идентфиикатор компании
  title: string;            // Наименование
  description?: string;     // Описание
  type: string;             // Тип вознаграждения
  start: Date;              // Дата начала
  end: Date;                // Дата окончания
  value: any;               // Величиниа вознаграждения

  /**
   * Конструктор
   * @param {IRewardDTO} config - Параметры инициализации
   */
  constructor(config?: IRewardDTO) {
    this.id = config ? config.id : 0;
    this.companyId = config ? config.company_id : 0;
    this.title = config ? config.name : '';
    this.description = config && config.description ? config.description : '';
    this.type = config ? config.type : '';
    this.start = config ? new Date(config.from) : new Date();
    this.end = config ? new Date(config.to) : new Date();
    this.value = config ? config.value : null;
  }
}
