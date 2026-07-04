/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RestBulkUserRateLimitSettingsUpdateRequest = {
    settings?: {
        capacity?: number;
        fillRate?: number;
    };
    usernames?: Array<string>;
    whitelisted?: boolean;
};

