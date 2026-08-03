import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'react-hot-toast';
import { auctionApi } from '@/shared/api/client';
import { AUCTIONS_QUERY_KEY } from '@/features/auctions-list/model/useAuctionsList';
import { AUCTION_DETAIL_QUERY_KEY } from '@/features/auctions-list/model/usePrefetchAuction';
import { BETS_QUERY_KEY } from '@/features/auction-detail/model/useBets';
import type { ApiError } from '@/shared/types/api';

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

      toast.success('Ставка успешно сделана!');

      if (onSuccess) {
        onSuccess();
      } else {
        navigate({ to: `/auctions/${auctionId}` });
      }
    },

    onError: (error: unknown) => {
      const apiError = error as ApiError;

      if (apiError.status === 422) {
        const message =
          apiError.response?.data?.message || 'Некорректная ставка';
        toast.error(message);
      } else {
        toast.error(apiError.message || 'Не удалось сделать ставку');
      }
    },
  });
};
