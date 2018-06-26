import { IHeaderDTO } from '../dto/header.dto';

export class Header {
  id: number;
  type: string;
  url: string;
  backgroundColor: string;
  content: string;
  imageUrl: string;

  constructor(config?: IHeaderDTO) {
    this.id = config ? config.id : 0;
    this.type = 'header';
    this.url = config ? config.url : '';
    this.content = config ? config.text_content : '';
    this.backgroundColor = config ? config.background_color : '';
    this.imageUrl = config ? config.image_url : '';
  }
}
