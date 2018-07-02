import { IRKeeperConfigDTO } from '../dto/r-keeper-config.dto';

export class RKeeperConfig {
  id?: number;             // Идентификатор
  from?: number;           // Начало диапазона генерируемых кодов
  to?: number;             // Конец диапазона генерируемых кодов
  discount?: {             // Соотвествие типо вознаграждений типавм скидок
    product: number;
    money: number;
    discount: number;
    loyalty: number;
  };

  /**
   * Конструктор
   * @param {IRKeeperConfigDTO} config - Параметры инициализации
   */
  constructor(config?: IRKeeperConfigDTO) {
    this.id = config && config.id ? config.id : 0;
    this.from = config && config.reward_code_from ? config.reward_code_from : 0;
    this.to = config && config.reward_code_to ? config.reward_code_to : 1000;
    this.discount = {
      product: config && config.discount_types ? config.discount_types.product : 0,
      money: config && config.discount_types ? config.discount_types.money : 0,
      discount: config && config.discount_types ? config.discount_types.discount : 0,
      loyalty: config && config.discount_types ? config.discount_types.loyalty : 0
    };
  }
}
