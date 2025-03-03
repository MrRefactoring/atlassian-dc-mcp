/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FieldComparatorSource } from './FieldComparatorSource.js';
import type { FieldValueLoader } from './FieldValueLoader.js';
import type { LuceneFieldSorter } from './LuceneFieldSorter.js';
export type NavigableField = {
    columnCssClass?: string;
    columnHeadingKey?: string;
    defaultSortOrder?: string;
    hiddenFieldId?: string;
    id?: string;
    name?: string;
    nameKey?: string;
    sortComparatorSource?: FieldComparatorSource;
    sorter?: LuceneFieldSorter;
    valueLoader?: FieldValueLoader;
};

