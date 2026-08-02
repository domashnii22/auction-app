import { createRoute } from '@tanstack/react-router';
import { Route as RootRoute } from '../__root';
import { AuctionDetailPage } from '@/pages/auction-detail/ui/AuctionDetailPage';

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/auctions/$id',
  component: AuctionDetailPage,
});
