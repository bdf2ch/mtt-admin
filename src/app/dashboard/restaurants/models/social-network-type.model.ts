import { ISocialNetworkType } from '../interfaces/social-network-type.interface';
import { ESocialNetwork } from '../enums/social-network.enum';

export class SocialNetworkType implements ISocialNetworkType {
  id: number;
  index: string;
  title: string;
  type: ESocialNetwork;

  constructor(config?: ISocialNetworkType) {
    this.id = config ? config.id : 0;
    this.index = config ? config.index : '';
    this.title = config ? config.title : '';
  }
}
