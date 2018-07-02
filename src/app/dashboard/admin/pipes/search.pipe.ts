import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../../users/models/user.model';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: User[], search: string, onlyOwners: boolean): any {
    let result = [];
    value.forEach((item: User) => {
      if (search !== '') {
        const query = `${item.fio} ${item.email}`;
        if (query.toLowerCase().indexOf(search) !== -1) {
          if (onlyOwners) {
            if (item.isOwner) {
              result.push(item);
            }
          } else {
            result.push(item);
          }
        }
      } else {
        if (onlyOwners) {
          if (item.isOwner) {
            result.push(item);
          }
        } else {
          result = value;
        }
      }
    });
    return result;
  }

}
