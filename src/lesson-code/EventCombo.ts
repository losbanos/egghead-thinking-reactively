import {fromEvent, Observable, timer} from 'rxjs';
import {exhaustMap, filter, map, skip, take, takeUntil, takeWhile, tap} from 'rxjs/operators';

const anyKeyPress$: Observable<string> = fromEvent(document, 'keypress').pipe(
    map((event: Event) => (event as KeyboardEvent).key),
    tap(console.log)
);

function keyPressed(sourceKey: string): Observable<string> {
    return anyKeyPress$.pipe(
        filter((key: string) => key === sourceKey)
    )
}

export function keyCombo(triggerKeys: Array<string>): Observable<string> {
    const initiator: string = triggerKeys[0];
    return keyPressed(initiator).pipe(
        exhaustMap(() => {
            return anyKeyPress$.pipe(
                takeUntil(timer(3000)),
                takeWhile((pressedKey,index: number) => triggerKeys[index + 1] === pressedKey),
                skip(triggerKeys.length - 2),
                take(1)
            )
        })
    )
}

// const trigger$: Observable<string> = keyCombo(['a', 's', 'd', 'f']);
//
// interval(1000).pipe(
//     takeUntil(trigger$)
// ).subscribe(
//     n => console.log('n = ', n),
//     e => console.log,
//     () => console.log('Combo COMPLETED')
// )


// const anyKeyPressed$: Observable<string> = fromEvent(document, 'keypress').pipe(
//     map((event: Event) => (event as KeyboardEvent).key),
//     tap(console.log)
// );
// function keyPressed(inputKey: string) {
//     return anyKeyPressed$.pipe(filter(pressedKey => pressedKey === inputKey));
// }
//
// const comboTriggered: Observable<string> = keyCombo(['a', 's', 'a', 'f']);
// function keyCombo(triggerCombo: Array<string>) {
//     const comboInitator: string = triggerCombo[0];
//     return keyPressed(comboInitator).pipe(
//         switchMap(() => {
//             return anyKeyPressed$.pipe(
//                 takeUntil(timer(3000)),
//                 takeWhile((keyPressed: string, index: number) => keyPressed === triggerCombo[index + 1]),
//                 skip(triggerCombo.length - 2),
//                 take(1)
//             )
//         })
//     )
// }
// interval(1000).pipe(
//     takeUntil(comboTriggered)
// ).subscribe(
//     n => console.log('n = ', n),
//     e => console.error(e),
//     () => console.log('Combo COMPLETE')
// );
