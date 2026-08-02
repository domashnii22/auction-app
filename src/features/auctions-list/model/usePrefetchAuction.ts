import { useQueryClient } from '@tanstack/react-query';
import { auctionApi } from '@/shared/api/client';

export const AUCTION_DETAIL_QUERY_KEY = 'auction-detail';

export const usePrefetchAuction = () => {
  const queryClient = useQueryClient();

  const prefetchAuction = (id: string) => {
    const queryKey = [AUCTION_DETAIL_QUERY_KEY, id];
    const cachedData = queryClient.getQueryData(queryKey);

    if (!cachedData) {
      queryClient.prefetchQuery({
        queryKey,
        queryFn: () => auctionApi.getDetail(id),
        staleTime: 10 * 60 * 1000,
      });
    }
  };

  return { prefetchAuction };
};
