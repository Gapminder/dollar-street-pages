import {UrlParameters} from './interfaces';

export const DEBOUNCE_TIME = 100;
export const MOBILE_SIZE = 600;
export const MATRIX_GRID_CONTAINER_CLASS = 'images-container';
export const FAMILY_GRID_CONTAINER_CLASS = 'family-image-container';

export const DefaultUrlParameters: UrlParameters = {
  lang: 'en',
  thing: 'Families',
  countries: ['World'],
  regions: ['World'],
  zoom: '4',
  mobileZoom: '3',
  row: '1',
  lowIncome: '26',
  highIncome: '15000',
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
  '/map':  ['lang', 'thing']
};
