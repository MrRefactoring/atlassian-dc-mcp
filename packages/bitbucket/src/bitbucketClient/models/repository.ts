/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Project } from './project.js';
export type Repository = {
    archived?: boolean;
    description?: string;
    fork?: boolean;
    forkable?: boolean;
    hierarchyId?: string;
    id?: number;
    local?: boolean;
    name?: string;
    offline?: boolean;
    origin?: Repository;
    partition?: number;
    project?: Project;
    public?: boolean;
    readOnly?: boolean;
    remote?: boolean;
    scmId?: string;
    slug?: string;
    state?: Repository.state;
    statusMessage?: string;
};
export namespace Repository {
    export enum state {
        AVAILABLE = 'AVAILABLE',
        INITIALISATION_FAILED = 'INITIALISATION_FAILED',
        INITIALISING = 'INITIALISING',
        OFFLINE = 'OFFLINE',
    }
}


