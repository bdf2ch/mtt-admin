import { IUserDTO } from './user.dto';

export interface IClientDTO extends IUserDTO {
    company: any;
}
