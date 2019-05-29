import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { delay } from 'rxjs/operators';
import { COLORS } from '../model/colors.model';

export interface Colour {
    name: string;
    code: string;
}

const colours: Colour[] = [...COLORS];

export function simulateHttpSearch(term: string) {
    const regexp = RegExp(term + '*');
    return Observable
        .of(colours.filter(c => regexp.test(c.name)))
        .pipe(
            delay(1000)
        );
}
