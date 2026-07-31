import { PAGINATION } from '@/shared/config/pagination';
import { z } from 'zod';

export const searchSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(PAGINATION.DEFAULT_PAGE)
    .default(PAGINATION.DEFAULT_PAGE)
    .catch(PAGINATION.DEFAULT_PAGE),

  limit: z.coerce
    .number()
    .int()
    .min(PAGINATION.MIN_LIMIT)
    .max(PAGINATION.MAX_LIMIT)
    .default(PAGINATION.DEFAULT_LIMIT)
    .catch(PAGINATION.DEFAULT_LIMIT),

  cargo_num: z.string().optional().default('').catch(''),

  status: z.string().optional().default('').catch(''),

  statuses: z
    .string()
    .optional()
    .default('')
    .catch('')
    .transform((val) => (val ? val.split(',') : [])),

  auc_type: z.string().optional().default('').catch(''),

  load_city: z.string().optional().default('').catch(''),

  unload_city: z.string().optional().default('').catch(''),

  date_from: z
    .string()
    .optional()
    .default('')
    .catch('')
    .refine((val) => val === '' || !isNaN(Date.parse(val)), {
      message: 'Некорректный формат даты',
    }),

  date_to: z
    .string()
    .optional()
    .default('')
    .catch('')
    .refine((val) => val === '' || !isNaN(Date.parse(val)), {
      message: 'Некорректный формат даты',
    }),

  is_available: z.coerce.boolean().optional().default(true).catch(true),

  is_bidder: z.coerce.boolean().optional().default(true).catch(true),

  price_from: z.coerce.number().optional().default(0).catch(0),

  price_to: z.coerce.number().optional().default(0).catch(0),
});

export type SearchParams = z.infer<typeof searchSchema>;
