import { IRewardType } from '../interfaces/reward-type.interface';
import { IRewardTypeDTO } from '../dto/reward-type.dto';

/**
 * Класс, реализующий интерфейс типа вознаграждения
 */
export class RewardType implements IRewardType {
  code: string;       // Код типа
  title: string;      // Наименование типа

  /**
   * Конструктор
   * @param {IRewardTypeDTO} config - Параметры инициализации
   */
  constructor(config?: IRewardTypeDTO) {
    this.code = config ? config.code : '';
    this.title = config ? config.title : '';
  }
}
