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

export interface AppStore {
    app: any;
    matrix: any;
    streetSettings: any;
    thingsFilter: any;
    countriesFilter: any;
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
