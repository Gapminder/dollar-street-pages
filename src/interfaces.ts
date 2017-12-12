export interface AppStates {
    app: any;
    matrix: any;
    streetSettings: any;
    thingsFilter: any;
    countriesFilter: any;
}

export interface ImageResolutionInterface {
    image: string;
    expand: string;
    full: string;
}

export interface UrlParamsInterface {
  thing: string;
  countries: string;
  regions: string;
  zoom: number;
  row: number;
  lowIncome?: number;
  highIncome?: number;
}

export interface DrawDividersInterface {
  showDividers: boolean;
  low: number;
  medium: number;
  high: number;
  poor: number;
  rich: number;
  lowDividerCoord: number;
  mediumDividerCoord: number;
  highDividerCoord: number;
}


export interface Place {
  background: string;
  country: string;
  image: string;
  income: number;
  incomeQuality: number;
  isUploaded: boolean;
  lat: number;
  lng: number;
  region: string;
  showIncome: string;
  _id: string;
  pinned?: boolean;
  showBackground?: string;
}
