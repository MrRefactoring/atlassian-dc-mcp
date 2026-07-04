/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Project = {
    description?: string;
    id?: number;
    key?: string;
    name?: string;
    public?: boolean;
    type?: Project.type;
};
export namespace Project {
    export enum type {
        NORMAL = 'NORMAL',
        PERSONAL = 'PERSONAL',
    }
}

