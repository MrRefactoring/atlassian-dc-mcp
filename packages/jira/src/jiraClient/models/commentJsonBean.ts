/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityPropertyBean } from './entityPropertyBean.js';
import type { UserJsonBean } from './userJsonBean.js';
import type { VisibilityJsonBean } from './visibilityJsonBean.js';
export type CommentJsonBean = {
    author?: UserJsonBean;
    body?: string;
    created?: string;
    id?: string;
    properties?: Array<EntityPropertyBean>;
    renderedBody?: string;
    self?: string;
    updateAuthor?: UserJsonBean;
    updated?: string;
    visibility?: VisibilityJsonBean;
};

