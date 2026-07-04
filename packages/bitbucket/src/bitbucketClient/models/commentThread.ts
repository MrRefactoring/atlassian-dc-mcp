/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplicationUser } from './applicationUser.js';
import type { Comment } from './comment.js';
import type { Commentable } from './commentable.js';
import type { CommentThreadDiffAnchor } from './commentThreadDiffAnchor.js';
export type CommentThread = {
    anchor?: CommentThreadDiffAnchor;
    anchored?: boolean;
    commentable?: Commentable;
    createdDate?: string;
    id?: number;
    resolved?: boolean;
    resolvedDate?: string;
    resolver?: ApplicationUser;
    rootComment?: Comment;
    updatedDate?: string;
};


