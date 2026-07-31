import { z } from 'zod';

export const searchSchema = z.object({
  page: z.number().int().min(1).default(1).catch(1),

  limit: z.number().int().min(1).max(50).default(3).catch(3),

  cargo_num: z.string().optional().default('').catch(''),

  status: z
    .enum(['Active', 'Completed', 'Cancelled'])
    .optional()
    .default('Active')
    .catch('Active'),

  statuses: z
    .string()
    .optional()
    .default('')
    .catch('')
    .transform((val) => (val ? val.split(',') : [])),

  auc_type: z
    .enum(['Request', 'Up', 'Down', 'FixPrice'])
    .optional()
    .default('Request')
    .catch('Request'),

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

  price_from: z
    .string()
    .optional()
    .default('')
    .catch('')
    .transform((val) => (val ? Number(val) : undefined)),

  price_to: z
    .string()
    .optional()
    .default('')
    .catch('')
    .transform((val) => (val ? Number(val) : undefined)),
});

export type SearchParams = z.infer<typeof searchSchema>;
