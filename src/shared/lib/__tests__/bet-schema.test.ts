import { describe, it, expect } from 'vitest';
import { betSchema } from '@/features/bet-form/model/betSchema';

describe('betSchema', () => {
  const minPrice = 1000;
  const maxPrice = 5000;
  const step = 500;

  const schema = betSchema(minPrice, maxPrice, step);

  it('валидирует корректную ставку', () => {
    const validData = { price: 2000 };
    const result = schema.safeParse(validData);

    expect(result.success).toBe(true);
  });

  it('отклоняет цену меньше минимума', () => {
    const invalidData = { price: 500 };
    const result = schema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Минимальная ставка');
    }
  });

  it('отклоняет цену больше максимума', () => {
    const invalidData = { price: 6000 };
    const result = schema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Максимальная ставка');
    }
  });

  it('отклоняет цену некратную шагу', () => {
    const invalidData = { price: 1250 };
    const result = schema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('кратна шагу ставки');
    }
  });

  it('отклоняет отрицательную цену', () => {
    const invalidData = { price: -100 };
    const result = schema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('больше 0');
    }
  });

  it('отклоняет нечисловое значение', () => {
    const invalidData = { price: 'abc' as any };
    const result = schema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });
});
