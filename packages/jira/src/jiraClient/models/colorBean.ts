import { z } from 'zod';

export type ColorBean = {
  key?: ColorBean.key;
};

export namespace ColorBean {
  export enum key {
    COLOR_1 = 'color_1',
    COLOR_2 = 'color_2',
    COLOR_3 = 'color_3',
    COLOR_4 = 'color_4',
    COLOR_5 = 'color_5',
    COLOR_6 = 'color_6',
    COLOR_7 = 'color_7',
    COLOR_8 = 'color_8',
    COLOR_9 = 'color_9',
    COLOR_10 = 'color_10',
    COLOR_11 = 'color_11',
    COLOR_12 = 'color_12',
    COLOR_13 = 'color_13',
    COLOR_14 = 'color_14',
  }
}

const ColorBean_keySchema = z.enum(['color_1', 'color_2', 'color_3', 'color_4', 'color_5', 'color_6', 'color_7', 'color_8', 'color_9', 'color_10', 'color_11', 'color_12', 'color_13', 'color_14']);

export const ColorBeanSchema = z.looseObject({
  key: ColorBean_keySchema.optional(),
}) as unknown as z.ZodType<ColorBean>;
