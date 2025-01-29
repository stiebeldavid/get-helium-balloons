export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  type: 'Kroger' | 'Albertsons' | 'Publix' | 'Safeway' | 'Food Lion' | 'Dollar Tree' | 'Dollar General' | 'Family Dollar' | 'Five Below' | '99 Cents Only' | 'Walmart' | 'Michaels' | 'CVS';
  distance?: number;
}

export interface Location {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  zipCode: string;
}