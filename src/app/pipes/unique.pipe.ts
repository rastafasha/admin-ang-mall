import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'unique'
})
export class UniquePipe implements PipeTransform {

    transform(array: Array<any>, prop: string): any {
        if (!array) return array;
        
        const uniqueMap = new Map();
        const result: any[] = [];
        
        for (const item of array) {
            const key = item[prop];
            if (!uniqueMap.has(key)) {
                uniqueMap.set(key, true);
                result.push(item);
            }
        }
        
        return result;
    }

}

