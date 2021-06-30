import { Observable, merge } from 'rxjs';
import {mapTo, scan} from 'rxjs/operators';

const taskStart: Observable<any> = new Observable();
const taskComplete: Observable<any> = new Observable();
const showSpinner: Observable<any> = new Observable();

const loadVariables: Observable<number> = merge(taskStart.pipe(mapTo(1)), taskComplete.pipe(mapTo(-1)));
loadVariables.pipe(
    scan((totalLoads, changeInLoads) => {
        return totalLoads + changeInLoads;
    }, 0)
)
export default {

}