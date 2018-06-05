import { ESocialNetwork } from '../enums/social-network.enum';
import {SocialNetworkType} from "../models/social-network-type.model";

/**
 * Интерфейс, описывающий социальную сеть
 */
export interface ISocialNetwork {
  id: number;                   // Идентификатор
  type: string;                 // Тип
  url: string;                  // Ссылка
}
