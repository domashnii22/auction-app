import { PAGINATION } from '@/shared/config/pagination';
import { z } from 'zod';

export const searchSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(PAGINATION.DEFAULT_PAGE)
    .catch(PAGINATION.DEFAULT_PAGE),

  limit: z.coerce
    .number()
    .int()
    .min(PAGINATION.MIN_LIMIT)
    .max(PAGINATION.MAX_LIMIT)
    .default(PAGINATION.DEFAULT_LIMIT)
    .catch(PAGINATION.DEFAULT_LIMIT),

  cargo_num: z
    .string()
    .optional()
    .default('')
    .catch('')
    .transform((val) => (val ? val : undefined)),

  status: z
    .string()
    .optional()
    .default('')
    .catch('')
    .transform((val) => (val ? val : undefined)),

  statuses: z
    .string()
    .optional()
    .default('')
    .catch('')
    .transform((val): string[] | undefined => {
      if (!val) return undefined;
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : undefined;
      } catch {
        return undefined;
      }
    }),

  auc_type: z
    .string()
    .optional()
    .default('')
    .catch('')
    .transform((val) => (val ? val : undefined)),

  load_city: z
    .string()
    .optional()
    .default('')
    .catch('')
    .transform((val) => (val ? val : undefined)),

  unload_city: z
    .string()
    .optional()
    .default('')
    .catch('')
    .transform((val) => (val ? val : undefined)),

  date_from: z
    .string()
    .optional()
    .default('')
    .catch('')
    .transform((val) => (val ? val : undefined))
    .refine((val) => val === undefined || !isNaN(Date.parse(val)), {
      message: 'Некорректный формат даты',
    }),

  date_to: z
    .string()
    .optional()
    .default('')
    .catch('')
    .transform((val) => (val ? val : undefined))
    .refine((val) => val === undefined || !isNaN(Date.parse(val)), {
      message: 'Некорректный формат даты',
    }),

  is_available: z.coerce
    .boolean()
    .optional()
    .default(false)
    .catch(false)
    .transform((val) => (val ? val : undefined)),

  is_bidder: z.coerce
    .boolean()
    .optional()
    .default(false)
    .catch(false)
    .transform((val) => (val ? val : undefined)),

  price_from: z.coerce
    .number()
    .optional()
    .default(0)
    .catch(0)
    .transform((val) => (val ? val : undefined)),

  price_to: z.coerce
    .number()
    .optional()
    .default(0)
    .catch(0)
    .transform((val) => (val ? val : undefined)),
});

export type SearchParams = z.infer<typeof searchSchema>;
