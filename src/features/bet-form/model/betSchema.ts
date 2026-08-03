import { z } from 'zod';

export const betSchema = (minPrice: number, maxPrice: number, step: number) =>
  z.object({
    price: z
      .number({
        message: 'Введите сумму ставки',
      })
      .refine((val) => val > 0, {
        message: 'Сумма должна быть больше 0',
      })
      .refine((val) => val >= minPrice, {
        message: `Минимальная ставка: ${minPrice.toLocaleString()} ₽`,
      })
      .refine((val) => val <= maxPrice, {
        message: `Максимальная ставка: ${maxPrice.toLocaleString()} ₽`,
      })
      .refine((val) => (val - minPrice) % step === 0, {
        message: `Сумма должна быть кратна шагу ставки (${step.toLocaleString()} ₽)`,
      }),
  });

export type BetFormValues = z.infer<ReturnType<typeof betSchema>>;
