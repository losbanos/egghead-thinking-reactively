import {newTaskStarted, existTaskCompleted} from '../lesson-code/TaskProgressService';
import Button from './presentational/Button';
import React from 'react';
import {PromiseWithLoadingProgress} from '../lesson-code/Extensions';

const doQuickWork = () => {
    new PromiseWithLoadingProgress((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 300)
    })
}


const doVeryQuickWork = () => {
    new PromiseWithLoadingProgress((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 2200)
    })
}

const FastExample = () => {
    return (
        <>
            <Button onClick={doQuickWork}>QUICK TASK - 300MS</Button>
            <Button onClick={doVeryQuickWork}>ALMOST QUICK TASK - 2200MS</Button>
        </>
    );
};

export default FastExample;
