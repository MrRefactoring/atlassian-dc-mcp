/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TimeTrackingConfigurationBean = {
    defaultUnit?: TimeTrackingConfigurationBean.defaultUnit;
    timeFormat?: TimeTrackingConfigurationBean.timeFormat;
    workingDaysPerWeek?: number;
    workingHoursPerDay?: number;
};
export namespace TimeTrackingConfigurationBean {
    export enum defaultUnit {
        MINUTE = 'minute',
        HOUR = 'hour',
        DAY = 'day',
        WEEK = 'week',
    }
    export enum timeFormat {
        PRETTY = 'pretty',
        DAYS = 'days',
        HOURS = 'hours',
    }
}

