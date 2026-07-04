/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type NodeBean = {
    alive?: boolean;
    cacheListenerPort?: number;
    ip?: string;
    lastStateChangeTimestamp?: number;
    nodeBuildNumber?: number;
    nodeId?: string;
    nodeVersion?: string;
    state?: NodeBean.state;
};
export namespace NodeBean {
    export enum state {
        ACTIVE = 'ACTIVE',
        PASSIVE = 'PASSIVE',
        ACTIVATING = 'ACTIVATING',
        PASSIVATING = 'PASSIVATING',
        OFFLINE = 'OFFLINE',
    }
}

