export interface IAuction {
  id: string;
  cargoNumber: string;
  type: AuctionTypesValues;
  status: 'Active' | 'Completed' | 'Cancelled';
  route: {
    from: string;
    to: string;
  };
  cargo: {
    name: string;
    weight: number;
    volume: number;
    bodyType: string;
  };
  currentPrice: number;
  pricePerKm: number;
  step: number;
  trading: {
    canSetBet: boolean;
    myBet?: number;
    userStatus: 'Leading' | 'Losing' | 'Winner' | 'NotParticipating';
    minPrice: number;
    maxPrice: number;
  };
  dates: {
    loading: string;
    unloading: string;
  };
  organizer: {
    name: string;
    contacts?: {
      phone?: string;
      email?: string;
    };
  };
  hideBetsHistory: boolean;
  hidePointsAddressAndContacts: boolean;
  noViewCargoPrice: boolean;
  bets: IBet[];
}

export type AuctionTypesValues = 'Request' | 'Up' | 'Down' | 'FixPrice';

export interface IBet {
  id: string;
  price: number;
  participant: string;
  rating: number;
  isWinner: boolean;
  isCancelled: boolean;
  cancelReason?: string;
  createdAt: string;
}

export interface IAuctionsListResponse {
  items: IAuction[];
  total: number;
  page: number;
  totalPages: number;
}

export interface IBetsListResponse {
  bets: IBet[];
  total: number;
}

export interface IAuctionsListRequest {
  page: number;
  limit: number;
  filters?: IAuctionFilters;
}

export interface IAuctionFilters {
  cargo_num?: string;
  status?: StatusValues;
  statuses?: string[] | [];
  auc_type?: TypeValues;
  load_city?: string;
  unload_city?: string;
  date_from?: string;
  date_to?: string;
  is_available?: boolean;
  is_bidder?: boolean;
  price_from?: number;
  price_to?: number;
}

export type StatusValues = 'Active' | 'Completed' | 'Cancelled';

export type TypeValues = 'Request' | 'Up' | 'Down' | 'FixPrice';
