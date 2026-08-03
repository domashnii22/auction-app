import type { IAuction, IBet } from '@/shared/types/api/auctions';

export const formatPrice = (price: number): string => {
  return `${price.toLocaleString()} ₽`;
};

export const formatDate = (date: string): string => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const mapAuctionToCardViewModel = (auction: IAuction) => ({
  id: auction.id,
  title: `Заявка #${auction.cargoNumber}`,
  route: `${auction.route.from} → ${auction.route.to}`,
  price: formatPrice(auction.currentPrice),
  status: auction.status,
  type: auction.type,
  userStatus: auction.trading.userStatus,
  canSetBet: auction.trading.canSetBet,
  hasMyBet: auction.trading.myBet !== undefined,
  step: auction.step,
  cargoInfo: `${auction.cargo.name} · ${auction.cargo.weight} кг · ${auction.cargo.volume} м³`,
  loadingDate: formatDate(auction.dates.loading),
});

export const mapBetToViewModel = (bet: IBet) => {
  let status = 'Участник';
  let statusColor: 'success' | 'default' | 'error' = 'default';

  if (bet.isCancelled) {
    status = 'Отменена';
    statusColor = 'error';
  } else if (bet.isWinner) {
    status = 'Победитель';
    statusColor = 'success';
  }

  return {
    id: bet.id,
    price: formatPrice(bet.price),
    participant: bet.participant,
    status,
    statusColor,
    date: formatDate(bet.createdAt),
    isWinner: bet.isWinner,
    isCancelled: bet.isCancelled,
  };
};
