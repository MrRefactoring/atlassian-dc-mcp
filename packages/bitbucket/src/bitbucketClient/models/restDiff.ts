import { z } from 'zod';

export const RestDiffSchema = z.looseObject({
  fromHash: z.unknown().nullable().optional(),
  toHash: z.string().optional(),
  contextLines: z.number().optional(),
  whitespace: z.string().optional(),
  diffs: z.array(z.looseObject({
    source: z.unknown().nullable().optional(),
    destination: z.looseObject({
      components: z.array(z.string()).optional(),
      parent: z.string().optional(),
      name: z.string().optional(),
      extension: z.string().optional(),
      toString: z.string().optional(),
    }).optional(),
    hunks: z.array(z.looseObject({
      sourceLine: z.number().optional(),
      sourceSpan: z.number().optional(),
      destinationLine: z.number().optional(),
      destinationSpan: z.number().optional(),
      segments: z.array(z.looseObject({
        type: z.string().optional(),
        lines: z.array(z.looseObject({
          source: z.number().optional(),
          destination: z.number().optional(),
          line: z.string().optional(),
          truncated: z.boolean().optional(),
        })).optional(),
        truncated: z.boolean().optional(),
      })).optional(),
      truncated: z.boolean().optional(),
    })).optional(),
    truncated: z.boolean().optional(),
  })).optional(),
  truncated: z.boolean().optional(),
});

export type RestDiff = z.infer<typeof RestDiffSchema>;
