/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityPropertyBean } from './EntityPropertyBean.js';
import type { UserJsonBean } from './UserJsonBean.js';
import type { VisibilityJsonBean } from './VisibilityJsonBean.js';
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

