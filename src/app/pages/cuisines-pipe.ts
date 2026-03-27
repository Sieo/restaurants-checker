import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cuisines'
})
export class CuisinesPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
