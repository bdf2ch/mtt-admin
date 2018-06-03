import { ESocialNetwork } from '../enums/social-network.enum';

/**
 * Интерфейс, описывающий социальную сеть
 */
export interface ISocialNetwork {
  id: number;               // Идентификатор
  type: ESocialNetwork;     // Тип
  url: string;              // Ссылка
}
