import { Action } from '@ngrx/store';


export const UPDATE_LANGUAGE = 'UPDATE_LANGUAGE';
export const UPDATE_TRANSLATIONS = 'UPDATE_TRANSLATIONS';

export class UpdateLanguage implements Action {
  readonly type = UPDATE_LANGUAGE;
  constructor(public payload: string) {}
}

export class UpdateTranslations implements Action {
  readonly type = UPDATE_TRANSLATIONS;
  constructor(public payload: string) {}
}

export type Actions =
  | UpdateLanguage
  | UpdateTranslations;
