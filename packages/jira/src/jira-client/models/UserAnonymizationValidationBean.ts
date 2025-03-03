/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AffectedEntityBean } from './AffectedEntityBean.js';
import type { ErrorCollection } from './ErrorCollection.js';
export type UserAnonymizationValidationBean = {
    affectedEntities?: Record<string, Array<AffectedEntityBean>>;
    businessLogicValidationFailed?: boolean;
    deleted?: boolean;
    displayName?: string;
    email?: string;
    errors?: Record<string, ErrorCollection>;
    expand?: string;
    operations?: Array<string>;
    success?: boolean;
    userKey?: string;
    userName?: string;
    warnings?: Record<string, ErrorCollection>;
};

