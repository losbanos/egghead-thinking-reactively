import {interval, MonoTypeOperatorFunction, Observable, Subscription} from 'rxjs';
import {take, takeUntil} from 'rxjs/operators';
import {newTaskStarted, existTaskCompleted} from './TaskProgressService';

export function showLoadingStatus<T>(): MonoTypeOperatorFunction<any> {
    return <T>(source: Observable<T>) => {
        return new Observable<T>((subscriber) => {
            newTaskStarted();
            console.log('task started ...');
            const sourceSubscription: Subscription = source.subscribe(subscriber);
            return () => {
                sourceSubscription.unsubscribe();
                existTaskCompleted();
                console.log('task Completed ...');
            }
        });
    }
}
//
// interval(500).pipe(
//     take(2),
//     showLoadingStatus()
// ).subscribe(
//     n => console.log('n = ', n),
//     e => console.log(e),
//     () => console.log('Complete')
// )

export class PromiseWithLoadingProgress<T> extends Promise<T> {
    constructor(callback: (resolve: () => void, reject: () => void) => void) {
        super((originalResolve, originalReject) => {
            const resolveSpy: () => void = (...args: Array<any>) => {
                originalResolve(...args);
                console.log('call original Resolve');
                existTaskCompleted();
            }
            const rejectSpy: () => void = (...args: Array<any>) => {
                originalReject(...args);
                console.log('call original REJECT');
                existTaskCompleted();
            }
            callback(resolveSpy, rejectSpy);
        });
        newTaskStarted();
    }
}
