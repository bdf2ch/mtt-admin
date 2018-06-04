import { ESocialNetwork } from '../enums/social-network.enum';
import { SocialNetworkType } from '../models/social-network-type.model';
import {ISocialNetworkTypeDTO} from "./social-network-type.dto";

export interface ISocialNetworkDTO {
  id: number;
  restaurant_id: number;
  network_type: ISocialNetworkTypeDTO;
  url: string;
  timeCreated?: number;
}
