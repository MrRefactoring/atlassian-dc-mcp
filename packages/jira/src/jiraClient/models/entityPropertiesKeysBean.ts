import { z } from 'zod';
import { EntityPropertyKeyBeanSchema, type EntityPropertyKeyBean } from './entityPropertyKeyBean.js';

export type EntityPropertiesKeysBean = {
    keys?: Array<EntityPropertyKeyBean>;
};

export const EntityPropertiesKeysBeanSchema = z.lazy(() => z.looseObject({
  keys: z.array(EntityPropertyKeyBeanSchema).optional(),
})) as unknown as z.ZodType<EntityPropertiesKeysBean>;
