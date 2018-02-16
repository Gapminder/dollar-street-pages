import { Action } from '@ngrx/store';


export const UPDATE_LANGUAGE = 'UPDATE_LANGUAGE';

export class UpdateLanguage implements Action {
  readonly type = UPDATE_LANGUAGE;
  constructor(public payload: string) {}
}

export type Actions =
  | UpdateLanguage;
