import React from 'react';
import {Observable, timer} from 'rxjs';
import Button from './presentational/Button';
import {existTaskCompleted, newTaskStarted} from '../lesson-code/TaskProgressService';

const slow$: Observable<number> = timer(3000);
const verySlow$: Observable<number> = timer(6000);

const doWork: () => void = () => {
    newTaskStarted()
    slow$.subscribe(() => {
        existTaskCompleted();
    })
}

const doLongWork: () => void = () => {
    newTaskStarted();
    verySlow$.subscribe(() => {
        existTaskCompleted();
    });
}

const SlowButtons = () => {
    return (
        <>
            <Button onClick={doWork}>Start slow task - 3s</Button>
            <Button onClick={doLongWork}>START VERY SLOW TASK - 6S</Button>
        </>
    );
}

export default SlowButtons;


