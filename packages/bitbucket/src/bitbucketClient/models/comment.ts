import { z } from 'zod';

export const CommentSchema = z.looseObject({
  properties: z.looseObject({
    repositoryId: z.number().optional(),
  }).optional(),
  id: z.number().optional(),
  version: z.number().optional(),
  text: z.string().optional(),
  // Attaches the comment to a file/line in the diff. Declared here so `pickBody(params,
  // CommentSchema)` keeps it in the POST body — otherwise an inline comment silently posts
  // as a general (unanchored) comment. looseObject: extra fields (multilineMarker/Span, …) pass through.
  anchor: z.looseObject({
    path: z.string().optional(),
    srcPath: z.string().optional(),
    line: z.number().optional(),
    lineType: z.string().optional(),
    fileType: z.string().optional(),
    diffType: z.string().optional(),
    fromHash: z.string().optional(),
    toHash: z.string().optional(),
  }).optional(),
  // Parent reference for a reply; without it a reply posts as a top-level comment.
  parent: z.looseObject({
    id: z.number().optional(),
  }).optional(),
  author: z.looseObject({
    name: z.string().optional(),
    emailAddress: z.string().optional(),
    active: z.boolean().optional(),
    displayName: z.string().optional(),
    id: z.number().optional(),
    slug: z.string().optional(),
    type: z.string().optional(),
    links: z.looseObject({
      self: z.array(z.looseObject({
        href: z.string().optional(),
      })).optional(),
    }).optional(),
  }).optional(),
  createdDate: z.number().optional(),
  updatedDate: z.number().optional(),
  comments: z.array(z.unknown()).optional(),
  threadResolved: z.boolean().optional(),
  severity: z.string().optional(),
  state: z.string().optional(),
  permittedOperations: z.looseObject({
    editable: z.boolean().optional(),
    transitionable: z.boolean().optional(),
    deletable: z.boolean().optional(),
  }).optional(),
});

export type Comment = z.infer<typeof CommentSchema>;
