import { useQuery } from '@tanstack/react-query';
import { auctionApi } from '@/shared/api/client';

export const BETS_QUERY_KEY = 'auction-bets';

export const useBets = (auctionId: string) => {
  return useQuery({
    queryKey: [BETS_QUERY_KEY, auctionId],
    queryFn: () => auctionApi.getBets(auctionId),
    enabled: !!auctionId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
