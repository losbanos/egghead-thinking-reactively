import {newTaskStarted, existTaskCompleted} from '../lesson-code/TaskProgressService';
import Button from './presentational/Button';
import React from 'react';

const doQuickWork = () => {
    newTaskStarted();
    new Promise((resolve, reject) => {
        setTimeout(() => {
            existTaskCompleted();
            resolve();
        }, 300)
    })
}


const doVeryQuickWork = () => {
    newTaskStarted();
    new Promise((resolve, reject) => {
        setTimeout(() => {
            existTaskCompleted();
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
