import {Pipe, PipeTransform} from '@angular/core';
import * as _ from 'lodash'
@Pipe({
    name: 'orderBy',
    standalone:false,
})
export class OrderByPipe implements PipeTransform {

    transform(array: Array<any>, args?: any): any {
        return _.sortBy(array, [args]);
    }

}