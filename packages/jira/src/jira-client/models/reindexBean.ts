/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReindexBean = {
    currentProgress?: number;
    currentSubTask?: string;
    finishTime?: string;
    progressUrl?: string;
    startTime?: string;
    submittedTime?: string;
    success?: boolean;
    type?: ReindexBean.type;
};
export namespace ReindexBean {
    export enum type {
        FOREGROUND = 'FOREGROUND',
        BACKGROUND = 'BACKGROUND',
        BACKGROUND_PREFFERED = 'BACKGROUND_PREFFERED',
        BACKGROUND_PREFERRED = 'BACKGROUND_PREFERRED',
    }
}

