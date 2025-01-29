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

export interface City {
  name: string;
  slug: string;
  state: string;
  description: string;
  popularAreas: string[];
  mainZipCodes: string[];
}

export interface EventType {
  name: string;
  slug: string;
  description: string;
  tips: string[];
  popularBalloonTypes: string[];
}

export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishDate: string;
  author: string;
  relatedEvents: string[];
  relatedCities: string[];
}