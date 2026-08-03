import { createRoute } from '@tanstack/react-router';
import { Route as RootRoute } from '../__root';
import { BetFormPage } from '@/pages/bet-form/ui/BetFormPage';

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/bet-form/$id',
  component: BetFormPage,
});
