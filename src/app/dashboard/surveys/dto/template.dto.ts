export interface ITemplateDTO {
  id?: number;
  type: string;
  url: string;
  text_content: string;
  background_color: string;
  image?: File;
  image_url?: string;
}
