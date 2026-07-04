/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplicationUser } from './applicationUser.js';
import type { CommentOperations } from './commentOperations.js';
import type { CommentThread } from './commentThread.js';
import type { CommentThreadDiffAnchor } from './commentThreadDiffAnchor.js';
export type Comment = {
    anchor?: CommentThreadDiffAnchor;
    author?: ApplicationUser;
    comments?: Array<Comment>;
    createdDate?: string;
    id?: number;
    permittedOperations?: CommentOperations;
    properties?: any;
    resolvedDate?: string;
    resolver?: ApplicationUser;
    severity?: Comment.severity;
    state?: Comment.state;
    text?: string;
    thread?: CommentThread;
    updatedDate?: string;
    version?: number;
};
export namespace Comment {
    export enum severity {
        NORMAL = 'NORMAL',
        BLOCKER = 'BLOCKER',
    }
    export enum state {
        OPEN = 'OPEN',
        PENDING = 'PENDING',
        RESOLVED = 'RESOLVED',
    }
}


