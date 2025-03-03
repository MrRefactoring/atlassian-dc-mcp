/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AffectedEntityBean = {
    description?: string;
    numberOfOccurrences?: number;
    type?: AffectedEntityBean.type;
    uri?: string;
    uriDisplayName?: string;
};
export namespace AffectedEntityBean {
    export enum type {
        ANONYMIZE = 'ANONYMIZE',
        TRANSFER_OWNERSHIP = 'TRANSFER_OWNERSHIP',
        REMOVE = 'REMOVE',
        MANUAL = 'MANUAL',
    }
}

