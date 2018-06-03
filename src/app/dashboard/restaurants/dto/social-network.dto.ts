import { ESocialNetwork } from '../enums/social-network.enum';

export interface ISocialNetworkDTO {
  id: number;
  restaurant_id: number;
  network_type: ESocialNetwork;
  url: string;
}
