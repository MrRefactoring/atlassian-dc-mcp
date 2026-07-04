/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FieldComparatorSource } from './fieldComparatorSource.js';
import type { FieldValueLoader } from './fieldValueLoader.js';
import type { LuceneFieldSorter } from './luceneFieldSorter.js';
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

