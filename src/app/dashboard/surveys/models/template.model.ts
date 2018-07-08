import { ITemplateDTO } from '../dto/template.dto';

export class Template {
  id: number;
  type: string;
  url: string;
  backgroundColor: string;
  content: string;
  imageUrl: string;
  image?: File | null;

  constructor(config?: ITemplateDTO) {
    this.id = config ? config.id : 0;
    this.type = config ? config.type : 'header';
    this.url = config ? config.url : '';
    this.content = config ? config.text_content : '';
    this.backgroundColor = config ? config.background_color : '';
    this.imageUrl = config ? config.image_url : '';
    this.image = config && config.image ? config.image : null;
  }

  toDTO(): ITemplateDTO {
    const dto: ITemplateDTO = {
      id: this.id,
      type: this.type,
      url: this.url,
      text_content: this.content,
      background_color: this.backgroundColor,
      image: this.image
    };
    return dto;
  }

  toFormData(): FormData {
    const formData = new FormData();
    if (this.url && this.url !== '') {
      if (this.url.indexOf('http') === -1) {
        this.url = `http://${this.url}`;
      }
      formData.append('url', this.url);
    }
    if (this.content && this.content !== '') {
      formData.append('text_content', this.content);
    }
    if (this.backgroundColor && this.backgroundColor !== '') {
      formData.append('background_color', this.backgroundColor);
    }
    if (this.image) {
      formData.append('image', this.image);
    }
    console.log('form-data', formData);
    return formData;
  }
}
