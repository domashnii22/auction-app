import { createRoute } from '@tanstack/react-router';
import { Route as AuctionRoute } from './$id';
import { BetFormPage } from '@/pages/bet-form/ui/BetFormPage';

export const Route = createRoute({
  getParentRoute: () => AuctionRoute,
  path: '/bet-form',
  component: BetFormPage,
});
