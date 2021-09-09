import {Observable, merge, Subject, timer, combineLatest, fromEvent, interval} from 'rxjs';
import {
    distinctUntilChanged,
    mapTo,
    scan,
    shareReplay,
    startWith,
    filter,
    pairwise,
    switchMap,
    takeUntil,
    map, takeWhile, take, tap, skip
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

shouldShowSpinner$.pipe(
    switchMap(() => {
        return spinnerWithStats$.pipe(
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

const anyKeyPressed$: Observable<string> = fromEvent(document, 'keypress').pipe(
    map((event: Event) => (event as KeyboardEvent).key),
    tap(console.log)
);
function keyPressed(inputKey: string) {
    return anyKeyPressed$.pipe(filter(pressedKey => pressedKey === inputKey));
}

const comboTriggered: Observable<string> = keyCombo(['a', 's', 'd', 'f']);
function keyCombo(triggerCombo: Array<string>) {
    const comboInitator: string = triggerCombo[0];
    return keyPressed(comboInitator).pipe(
        switchMap(() => {
            return anyKeyPressed$.pipe(
                takeUntil(timer(3000)),
                takeWhile((keyPressed: string, index: number) => keyPressed === triggerCombo[index + 1]),
                skip(triggerCombo.length - 2),
                take(1)
            )
        })
    )
}
interval(1000).pipe(
    takeUntil(comboTriggered)
).subscribe(
    n => console.log('n = ', n),
    e => console.error(e),
    () => console.log('Combo COMPLETE')
);


export default {

}
