/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MoveFieldBean = {
    after?: string;
    position?: MoveFieldBean.position;
};
export namespace MoveFieldBean {
    export enum position {
        EARLIER = 'Earlier',
        LATER = 'Later',
        FIRST = 'First',
        LAST = 'Last',
    }
}

