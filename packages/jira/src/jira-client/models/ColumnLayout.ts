/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ColumnLayoutItem } from './ColumnLayoutItem.js';
export type ColumnLayout = {
    columnConfig?: ColumnLayout.columnConfig;
    columnLayoutItems?: Array<ColumnLayoutItem>;
};
export namespace ColumnLayout {
    export enum columnConfig {
        SYSTEM = 'SYSTEM',
        EXPLICIT = 'EXPLICIT',
        FILTER = 'FILTER',
        USER = 'USER',
        NONE = 'NONE',
    }
}

