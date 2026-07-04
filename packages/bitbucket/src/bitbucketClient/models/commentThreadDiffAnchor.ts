/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LineNumberRange } from './lineNumberRange.js';
export type CommentThreadDiffAnchor = {
    diffType?: CommentThreadDiffAnchor.diffType;
    fileAnchor?: boolean;
    fileType?: CommentThreadDiffAnchor.fileType;
    fromHash?: string;
    line?: number;
    lineAnchor?: boolean;
    lineType?: CommentThreadDiffAnchor.lineType;
    multilineAnchor?: boolean;
    multilineDestinationRange?: LineNumberRange;
    multilineSourceRange?: LineNumberRange;
    multilineStartLine?: number;
    multilineStartLineType?: CommentThreadDiffAnchor.multilineStartLineType;
    orphaned?: boolean;
    path?: string;
    srcPath?: string;
    toHash?: string;
};
export namespace CommentThreadDiffAnchor {
    export enum diffType {
        COMMIT = 'COMMIT',
        EFFECTIVE = 'EFFECTIVE',
        RANGE = 'RANGE',
    }
    export enum fileType {
        FROM = 'FROM',
        TO = 'TO',
    }
    export enum lineType {
        ADDED = 'ADDED',
        CONTEXT = 'CONTEXT',
        REMOVED = 'REMOVED',
    }
    export enum multilineStartLineType {
        ADDED = 'ADDED',
        CONTEXT = 'CONTEXT',
        REMOVED = 'REMOVED',
    }
}


