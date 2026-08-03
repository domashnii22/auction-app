import { z } from 'zod';

export const betSchema = (minPrice: number, maxPrice: number, step: number) =>
  z.object({
    price: z
      .number({
        error: 'Введите сумму ставки',
        message: 'Введите число',
      })
      .positive('Сумма должна быть больше 0')
      .min(minPrice, `Минимальная ставка: ${minPrice.toLocaleString()} ₽`)
      .max(maxPrice, `Максимальная ставка: ${maxPrice.toLocaleString()} ₽`)
      .refine((val) => (val - minPrice) % step === 0, {
        message: `Сумма должна быть кратна шагу ставки (${step.toLocaleString()} ₽)`,
      }),
  });

export type BetFormValues = z.infer<ReturnType<typeof betSchema>>;
