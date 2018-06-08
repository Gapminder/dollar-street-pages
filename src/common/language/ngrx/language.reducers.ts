import { DefaultUrlParameters } from '../../../defaultState';
import * as LanguageActions from './language.actions';
import { LanguageState, TranslationsInterface } from '../../../interfaces';

export const initialStage: LanguageState = {
  lang: DefaultUrlParameters.lang,
  translations: {}
}

export function languageReducer(state: LanguageState = initialStage, action: LanguageActions.Actions): LanguageState {
  switch (action.type) {
    case LanguageActions.UPDATE_LANGUAGE: {
      return Object.assign({}, state, {lang: action.payload});
    }
    case LanguageActions.UPDATE_TRANSLATIONS: {
      return Object.assign({}, state, {translations: action.payload});
    }
    default:
      return state;
  }
}
