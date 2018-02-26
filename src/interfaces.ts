export interface AppState {
  query: string;
}

export interface MatrixState {
  matrixImages: Place[];
  updateMatrix: boolean;
  pinMode: boolean;
  embedMode: boolean;
  isEmbederShared: boolean;
  pinCollapsed: boolean;
  showLabels: boolean;
  timeUnit: TimeUnit;
  timeUnits: TimeUnit[];
  currencyUnit: Currency;
  currencyUnits: Currency[];
  incomeFilter: boolean;
  quickGuide: boolean;
  placesSet: Place[];
  processImages: boolean;
  zoom: number;
  place: string;
  embedSetId: string;
  activeHouseOptions: {
    row: number;
    index: number;
  };
}

export interface StreetSettingsState {
  streetSettings: DrawDividersInterface;
}

export interface ThingsState {
  thingsFilter: {
    otherFilter?: {}[];
    popularThings?: {}[];
    relatedThings?: {}[];
    thing?: Thing;
  };
}

export interface Thing {
  isShowReadMore: boolean;
  relatedThings: string[];
  syninymous: {}[];
  icon: string;
  iconDark: string;
  iconLight: string;
  originPlural: string;
  plural: string;
  shortDescription: string;
  thingName: string;
  _id?: string;
}

export interface CountriesFilterState {
  countriesFilter: Continent;
  selectedCountries: string[];
  selectedRegions?: string[];
}

export interface AppStates {
    app: AppState;
    matrix: MatrixState;
    streetSettings: StreetSettingsState;
    thingsFilter: ThingsState;
    countriesFilter: CountriesFilterState;
    language: LanguageState;
}

export interface ImageResolutionInterface {
    image: string;
    expand: string;
    full: string;
}

export interface DrawDividersInterface {
  showDividers: boolean;
  showCurrency?: boolean;
  showLabels?: boolean;
  low: number;
  medium: number;
  high: number;
  poor: number;
  rich: number;
  lowDividerCoord: number;
  mediumDividerCoord: number;
  highDividerCoord: number;
  _id?: string;
  firstLabelName?: string;
  secondLabelName?: string;
  thirdLabelName?: string;
  fourthLabelName?: string;
  filters?: {
    lowIncome: number;
    highIncome: number;
  };
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
  showIncome: string | number;
  _id: string;
  pinned?: boolean;
  showBackground?: string;
}

export interface TimeUnit {
  code: string;
  name: string;
  name1?: string;
  per: string;
}

export interface Currency {
  currency: string;
  code: string;
  value: number;
  symbol: string;
  updated: Date | number;
  translations: {}[];
}

export interface Continent {
  countries: Country[];
  empty: boolean;
  originRegionName: string;
  region: string;
}

export interface Country {
  country: string;
  empty: boolean;
  originName: string;
  originRegionName: string;
  region: string;
}

export interface UrlParameters {
  lang?: string;
  thing?: string;
  countries?: string[];
  regions?: string[];
  zoom?: string;
  mobileZoom?: string;
  row?: string;
  lowIncome?: string;
  highIncome?: string;
  activeHouse?: string;
  activeImage?: string;
  place?: string;
  currency?: string;
  time?: string;
  embed?: string;
}

export interface LanguageState {
  lang: string;
}

export interface IncomeFilter {
  lowIncome: number;
  highIncome: number;
}

export interface Language {
  code: string;
  name: string;
  _id: string;
}

export interface PagePosition {
  row: number;
  activeHouse: number;
}

export interface TranslationsInterface {
  [key: string]: string;
}
