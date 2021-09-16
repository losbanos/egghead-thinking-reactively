import {Observable, merge, Subject, timer, combineLatest} from 'rxjs';
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
import {keyCombo} from './EventCombo';

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

interface LoadStats {
    previousLoading: number,
    total: number,
    completed: number
}
const loadStats$: Observable<any> = currentLoadCount$.pipe(
    scan((loadStats: LoadStats, loadingUpdate) => {
        const loadsWentDown: boolean = loadStats.previousLoading > loadingUpdate;
        const currentCompleted: number = loadsWentDown ? loadStats.completed + 1 : loadStats.completed;
        return {
            total: currentCompleted + loadingUpdate,
            completed: currentCompleted,
            previousLoading: loadingUpdate
        }
    }, {
        total: 0, completed: 0, previousLoading: 0
    })
)
const flashThreadHold: Observable<number> = timer(2000);

const spinnerDeactivated$: Observable<number> = currentLoadCount$.pipe(
    filter(count => count === 0)
);

const spinnerActivated$: Observable<Array<number>> = currentLoadCount$.pipe(
    pairwise(),
    filter(([prevCount, currentCount]) => prevCount === 0 && currentCount === 1)
);
const shouldHideSpinner$ = combineLatest(
    spinnerDeactivated$,
    flashThreadHold
)

const shouldShowSpinner$ = spinnerActivated$.pipe(
    switchMap(() => flashThreadHold.pipe(
        takeUntil(spinnerDeactivated$)
    ))
);

const showSpinner = (total: number, complete: number) => new Observable(() => {
    const loadingPromise: Promise<any> = initLoadingSpinner(total, complete);
    loadingPromise.then(spinner => spinner.show());

    return () => {
        loadingPromise.then(spinner => spinner.hide());
    }
});

const spinnerWithStats$: Observable<any> = loadStats$.pipe(
    switchMap((stats: LoadStats) => showSpinner(stats.total, stats.completed))
);
const hideSpinnerCombo$ = keyCombo(['q', 'w', 'e', 'r']);

shouldShowSpinner$.pipe(
    switchMap(() => {
        return spinnerWithStats$.pipe(
            takeUntil(shouldHideSpinner$)
        )
    }),
    takeUntil(hideSpinnerCombo$)
).subscribe();

export function newTaskStarted() {
    taskStart.next();
}
export function existTaskCompleted() {
    taskComplete.next();
}




export default {

}
