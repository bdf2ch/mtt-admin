import { ISocialNetworkType } from '../interfaces/social-network-type.interface';
import { ESocialNetwork } from '../enums/social-network.enum';

export class SocialNetworkType implements ISocialNetworkType {
  code: string;
  title: string;

  constructor(config?: ISocialNetworkType) {
    this.code = config ? config.code : '';
    this.title = config ? config.title : '';
  }
}
