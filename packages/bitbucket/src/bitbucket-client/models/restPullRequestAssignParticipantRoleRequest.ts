/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RestPullRequestAssignParticipantRoleRequest = {
    role?: RestPullRequestAssignParticipantRoleRequest.role;
    user?: {
        active?: boolean;
        avatarUrl?: string;
        displayName?: string;
        emailAddress?: string;
        readonly id?: number;
        links?: any;
        name?: string;
        slug?: string;
        type?: RestPullRequestAssignParticipantRoleRequest.type;
    };
};
export namespace RestPullRequestAssignParticipantRoleRequest {
    export enum role {
        AUTHOR = 'AUTHOR',
        REVIEWER = 'REVIEWER',
        PARTICIPANT = 'PARTICIPANT',
    }
    export enum type {
        NORMAL = 'NORMAL',
        SERVICE = 'SERVICE',
    }
}

