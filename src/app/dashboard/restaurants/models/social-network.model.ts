import { ISocialNetwork } from '../interfaces/social-network.interface';
import { ESocialNetwork } from '../enums/social-network.enum';

/**
 * Класс, реализующий интерфейс социальной сети
 */
export class SocialNetwork implements ISocialNetwork {
  id: number;               // Идентификатор
  index: number;            // Индекс
  type: ESocialNetwork;     // Тип
  url: string;              // Ссылка

  /**
   * Конструктор
   * @param {ISocialNetwork} config - Параметры инициализации
   */
  constructor(config?: ISocialNetwork) {
    this.id = config ? config.id : 0;
    this.index = config ? config.index : 0;
    this.type = config ? config.type : ESocialNetwork.FACEBOOK;
    this.url = config ? config.url : '';
  }
}
