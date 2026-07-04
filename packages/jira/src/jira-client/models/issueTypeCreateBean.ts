/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type IssueTypeCreateBean = {
    description?: string;
    name?: string;
    type?: IssueTypeCreateBean.type;
};
export namespace IssueTypeCreateBean {
    export enum type {
        SUBTASK = 'subtask',
        STANDARD = 'standard',
    }
}

