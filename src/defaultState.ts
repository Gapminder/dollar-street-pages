import {TimeUnitCode, UrlParameters} from './interfaces';

export const DEBOUNCE_TIME = 100;
export const MOBILE_SIZE = 600;
export const MATRIX_GRID_CONTAINER_CLASS = 'images-container';
export const FAMILY_GRID_CONTAINER_CLASS = 'family-image-container';
export const MAX_PINNED_PLACES = 6;
export const FAMILY_HEADER_PADDING = 185;

export const TIME_UNIT_CODES: {[key: string]: TimeUnitCode} = {
  day: {
    code: 'DAY',
    income: 'DAILY_INCOME'
  },
  week: {
    code: 'WEEK',
    income: 'WEEKLY_INCOME'
  },
  month: {
    code: 'MONTH',
    income: 'MONTHLY_INCOME'
  },
  year: {
    code: 'YEAR',
    income: 'YEARLY_INCOME'
  }
};

export const DefaultUrlParameters: UrlParameters = {
  lang: 'en',
  thing: 'Clinics',
  countries: ['World'],
  regions: ['World'],
  zoom: '4',
  mobileZoom: '4',
  row: '1',
  lowIncome: '13',
  highIncome: '10813',
  activeHouse: undefined,
  activeImage: undefined,
  place: undefined,
  currency: 'usd',
  time: 'month',
  embed: undefined,
};

export const VisibleParametersPerPage = {
  other:  ['lang'],
  '/matrix': [
    'lang',
    'thing',
    'countries',
    'regions',
    'zoom',
    'row',
    'lowIncome',
    'highIncome',
    'activeHouse',
    'currency',
    'time',
    'embed'
  ],
  embed: [
    'lang',
    'thing',
    'countries',
    'regions',
    'currency',
    'embed'
  ],
  '/family': ['lang', 'place', 'row', 'activeImage', 'zoom'],
  '/about':  ['lang'],
  '/map':  ['lang', 'thing'],
  '/': [
    'lang',
    'thing',
    'countries',
    'regions',
    'zoom',
    'row',
    'lowIncome',
    'highIncome',
    'activeHouse',
    'currency',
    'time',
    'embed',
    'place',
    'activeImage'
  ]
};

export const PinnedPlacesParameters = [
  'thing',
  'embed',
  'lang',
]
