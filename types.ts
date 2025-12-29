
export interface TrafficHotspot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  trafficLevel: 'Low' | 'Moderate' | 'Heavy' | 'Gridlock';
  trend: 'increasing' | 'decreasing' | 'stable';
  details: string;
}

export interface PredictionResult {
  score: number; // 0-100 (100 is worst)
  summary: string;
  factors: string[];
  bestTimeToLeave: string;
  alternativeRoutes: string[];
  groundingLinks: Array<{ uri: string; title: string }>;
}

export interface SearchParams {
  source: string;
  destination: string;
  time: string;
  day: string;
}

export enum TrafficZone {
  SILK_BOARD = 'Silk Board',
  HEBBAL = 'Hebbal Flyover',
  WHITEFIELD = 'Whitefield',
  ELECTRONIC_CITY = 'Electronic City',
  MARATHAHALLI = 'Marathahalli',
  INDIRANAGAR = 'Indiranagar',
  KORAMANGALA = 'Koramangala',
  M_G_ROAD = 'MG Road',
  TIN_FACTORY = 'Tin Factory'
}
