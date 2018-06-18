import { IReward } from '../interfaces/reward.interface';
import { IRewardDTO } from '../dto/reward.dto';

/**
 * Класс, реализующий интерфейс вознаграждения
 */
export class Reward implements IReward {
  id: number;                      // Идентификатор
  companyId: number;               // Идентфиикатор компании
  title: string;                   // Наименование
  description?: string | null;     // Описание
  type: string;                    // Тип вознаграждения
  start: Date;                     // Дата начала
  end?: Date | null;               // Дата окончания
  value: any;                      // Величиниа вознаграждения
  isAvailable: boolean;            // Доступно ли вознаграждение

  /**
   * Конструктор
   * @param {IRewardDTO} config - Параметры инициализации
   */
  constructor(config?: IRewardDTO) {
    this.id = config ? config.id : 0;
    this.companyId = config ? config.company_id : 0;
    this.title = config ? config.name : '';
    this.description = config && config.description ? config.description : null;
    this.type = config ? config.type : '';
    this.start = config ? new Date(config.from) : new Date();
    this.end = config && config.to ? new Date(config.to) : null;
    this.value = config ? config.value : null;
    this.isAvailable = config ? config.is_available : false;
  }
}
