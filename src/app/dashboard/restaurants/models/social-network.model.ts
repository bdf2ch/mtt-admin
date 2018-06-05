import { ISocialNetwork } from '../interfaces/social-network.interface';
import { ESocialNetwork } from '../enums/social-network.enum';
import { ISocialNetworkDTO } from '../dto/social-network.dto';
import { SocialNetworkType } from './social-network-type.model';

/**
 * Класс, реализующий интерфейс социальной сети
 */
export class SocialNetwork implements ISocialNetwork {
  id: number;                   // Идентификатор
  type: string;                 // Тип
  url: string;                  // Ссылка

  /**
   * Конструктор
   * @param {ISocialNetwork} config - Параметры инициализации
   */
  constructor(config?: ISocialNetworkDTO) {
    this.id = config ? config.id : 0;
    this.type = config ? config.network_type : '';
    this.url = config ? config.url : '';
  }
}
