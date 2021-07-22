import {Observable, merge, Subject, timer} from 'rxjs';
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
import {initLoadingSpinner} from '../services/LoadingSpinnerService';

const taskStart: Subject<any> = new Subject();
const taskComplete: Subject<any> = new Subject();

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

const spinnerDeactivated$: Observable<number> = currentLoadCount$.pipe(
    filter(count => count === 0)
);

const spinnerActivated$: Observable<Array<number>> = currentLoadCount$.pipe(
    pairwise(),
    filter(([prevCount, currentCount]) => prevCount === 0 && currentCount === 1)
);
const shouldShowSpinner$ = spinnerActivated$.pipe(
    switchMap(() => timer(2000).pipe(takeUntil(spinnerDeactivated$)))
)
const showSpinner: Observable<any> = new Observable(() => {
    const loadingPromise: Promise<any> = initLoadingSpinner();
    loadingPromise.then(spinner => spinner.show());

    return () => {
        loadingPromise.then(spinner => spinner.hide());
    }
});


shouldShowSpinner$.pipe(
    switchMap(() => {
        return showSpinner.pipe(
            takeUntil(spinnerDeactivated$)
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
