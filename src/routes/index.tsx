import { createRoute } from '@tanstack/react-router';
import { Route as RootRoute } from './__root';
import { AuctionsListPage } from '@/pages/auctions-list/ui/AuctionsListPage';

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/',
  component: AuctionsListPage,
});
