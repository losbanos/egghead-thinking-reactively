import {Observable, merge} from 'rxjs';
import {distinctUntilChanged, mapTo, scan, shareReplay, startWith} from 'rxjs/operators';

const taskStart: Observable<any> = new Observable();
const taskComplete: Observable<any> = new Observable();
const showSpinner: Observable<any> = new Observable();

const loadVariables: Observable<number> = merge(taskStart.pipe(mapTo(1)), taskComplete.pipe(mapTo(-1)));
const currentLoadCount$: Observable<number> = loadVariables.pipe(
    startWith(0),
    scan((totalLoads, changeInLoads) => {
        const newLoadCount: number = totalLoads + changeInLoads;
        return newLoadCount > 0 ? newLoadCount : 0;
    }),
    distinctUntilChanged(),
    shareReplay({bufferSize: 1, refCount: true})
)
export default {

}