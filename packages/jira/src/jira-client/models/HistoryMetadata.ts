/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HistoryMetadataParticipant } from './HistoryMetadataParticipant.js';
export type HistoryMetadata = {
    activityDescription?: string;
    activityDescriptionKey?: string;
    actor?: HistoryMetadataParticipant;
    cause?: HistoryMetadataParticipant;
    description?: string;
    descriptionKey?: string;
    emailDescription?: string;
    emailDescriptionKey?: string;
    extraData?: Record<string, string>;
    generator?: HistoryMetadataParticipant;
    type?: string;
};

