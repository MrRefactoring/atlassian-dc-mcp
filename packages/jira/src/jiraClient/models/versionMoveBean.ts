/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VersionMoveBean = {
    after?: string;
    position?: VersionMoveBean.position;
};
export namespace VersionMoveBean {
    export enum position {
        EARLIER = 'Earlier',
        LATER = 'Later',
        FIRST = 'First',
        LAST = 'Last',
    }
}

