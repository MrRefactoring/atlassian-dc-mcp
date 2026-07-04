/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MockAttachmentRequest = {
    /**
     * The name of the multipart/form-data parameter that contains attachments must be \"file\".
     */
    file?: string;
    /**
     * (optional) a list of \"comments\" matching the list of attachment data.\nIf supplied, the size of this list must match the size of the fileParts list.
     */
    comment?: string;
    /**
     * (optional) form parameter indicating whether the attachments should be \"minorEdits\".If \"minorEdits\" is set to true, no notification email will be generated for that attachment.
     */
    minorEdit?: boolean;
    /**
     * (optional) form parameter indicating whether the attachments should be \"hidden\".If \"hidden\" is set to true, no notification email or activity stream will be generated for that attachment.
     */
    hidden?: boolean;
};

