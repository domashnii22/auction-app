export interface IAuction {
  id: string;
  cargoNumber: string;
  type: 'Request' | 'Up' | 'Down' | 'FixPrice';
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
  bets: any[];
}

export interface IAuctionsListResponse {
  items: IAuction[];
  total: number;
  page: number;
  totalPages: number;
}

export interface IAuctionsListRequest {
  page: number;
  limit: number;
  filters?: IAuctionFilters;
}

export interface IAuctionFilters {
  cargo_num?: string;
  status?: 'Active' | 'Completed' | 'Cancelled';
  statuses?: string[];
  auc_type?: string;
  load_city?: string;
  unload_city?: string;
  date_from?: string;
  date_to?: string;
  is_available?: boolean;
  is_bidder?: boolean;
  price_from?: number;
  price_to?: number;
}
