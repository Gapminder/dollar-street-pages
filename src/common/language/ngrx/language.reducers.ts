import { DefaultUrlParameters } from '../../../url-parameters/defaultState';
import * as LanguageActions from './language.actions';
import { LanguageState } from '../../../interfaces';

export const initialStage: LanguageState = {
  lang: DefaultUrlParameters.lang
}

export function languageReducer(state: LanguageState = initialStage, action: LanguageActions.Actions): LanguageState {
  switch (action.type) {
    case LanguageActions.UPDATE_LANGUAGE: {
      return Object.assign({}, state, {lang: action.payload});
    }
    default:
      return state;
  }
}
