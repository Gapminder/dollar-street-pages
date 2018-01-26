import {UrlParameters} from "../interfaces";

export const DefaultUrlParameters: UrlParameters = {
  lang: 'en',
  thing: 'Families',
  countries: ['World'],
  regions: ['World'],
  zoom: '4',
  row: '1',
  lowIncome: '26',
  highIncome: '15000',
  activeHouse: undefined,
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
  '/family': ['lang', 'place'],
  '/about':  ['lang'],
  '/map':  ['lang', 'thing']
};
