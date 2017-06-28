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

export interface HeaderState {
    query: string;
    thing: any;
    hoverPlace: any;
}

export interface AppState {
    streetSettings: any;
    thingsFilter: any;
    countriesFilter: any;
    header: HeaderState;
}
