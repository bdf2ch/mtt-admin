import { ITemplateDTO } from '../dto/template.dto';

export class Footer {
  id: number;
  type: string;
  url: string;
  backgroundColor: string;
  content: string;
  imageUrl: string;

  constructor(config?: ITemplateDTO) {
    this.id = config ? config.id : 0;
    this.type = 'footer';
    this.url = config ? config.url : '';
    this.content = config ? config.text_content : '';
    this.backgroundColor = config ? config.background_color : '';
    this.imageUrl = config ? config.image_url : '';
  }
}
