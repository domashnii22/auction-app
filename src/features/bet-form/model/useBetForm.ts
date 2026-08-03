import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { auctionApi } from '@/shared/api/client';
import { AUCTIONS_QUERY_KEY } from '@/features/auctions-list/model/useAuctionsList';
import { AUCTION_DETAIL_QUERY_KEY } from '@/features/auctions-list/model/usePrefetchAuction';
import { BETS_QUERY_KEY } from '@/features/auction-detail/model/useBets';

interface UseBetFormOptions {
  auctionId: string;
  onSuccess?: () => void;
}

export const useBetForm = ({ auctionId, onSuccess }: UseBetFormOptions) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (price: number) => auctionApi.setBet(auctionId, price),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AUCTIONS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [AUCTION_DETAIL_QUERY_KEY, auctionId],
      });
      queryClient.invalidateQueries({ queryKey: [BETS_QUERY_KEY, auctionId] });

      if (onSuccess) {
        onSuccess();
      } else {
        navigate({ to: `/auctions/${auctionId}` });
      }
    },

    onError: (error: any) => {
      if (error.status === 422) {
        const message = error.response?.data?.message || 'Некорректная ставка';

        return message;
      }
    },
  });
};
