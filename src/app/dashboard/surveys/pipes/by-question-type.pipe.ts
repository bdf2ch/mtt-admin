import { Pipe, PipeTransform } from '@angular/core';
import { Question } from '../models/question.model';

@Pipe({
  name: 'byQuestionType',
  pure: true
})
export class ByQuestionTypePipe implements PipeTransform {

  transform(value: Question[], questionFormType: string): any {
    const result = [];
    value.forEach((item: Question) => {
      if (questionFormType !== '') {
        if (item.form.type === questionFormType) {
          result.push({
            label: item.title,
            value: item.id
          });
        }
      } else {
        result.push({
          label: item.title,
          value: item.id
        });
      }
    });
    return result;
  }

}
