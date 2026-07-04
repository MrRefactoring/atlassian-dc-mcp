/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RestRepositoryMirrorEvent = {
    mirrorRepoId?: number;
    type?: RestRepositoryMirrorEvent.type;
    upstreamRepoId?: string;
};
export namespace RestRepositoryMirrorEvent {
    export enum type {
        SYNCHRONIZED = 'SYNCHRONIZED',
        SYNCHRONIZATION_FAILED = 'SYNCHRONIZATION_FAILED',
    }
}

