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

export interface AppState {
    query: string;
    thing: any;
    hoverPlace: any;
}

export interface AppStore {
    app: any;
    streetSettings: any;
    thingsFilter: any;
    countriesFilter: any;
}
