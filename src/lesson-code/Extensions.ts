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
