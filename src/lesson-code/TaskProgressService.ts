import {Observable, merge, Subject} from 'rxjs';
import {
    distinctUntilChanged,
    mapTo,
    scan,
    shareReplay,
    startWith,
    filter,
    pairwise,
    switchMap,
    takeUntil
} from 'rxjs/operators';

const taskStart: Subject<any> = new Subject();
const taskComplete: Subject<any> = new Subject();
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

const shouldHideSpinner$: Observable<number> = currentLoadCount$.pipe(
    filter(count => count === 0)
);

const shouldShowSpinner$: Observable<Array<number>> = currentLoadCount$.pipe(
    pairwise(),
    filter(([prevCount, currentCount]) => prevCount === 0 && currentCount === 1)
);

shouldShowSpinner$.pipe(
    switchMap(() => {
        return showSpinner.pipe(
            takeUntil(shouldHideSpinner$)
        )
    })
).subscribe();

export function newTaskStarted() {
    taskStart.next();
}
export function existTaskCompleted() {
    taskComplete.next();
}
export default {

}
