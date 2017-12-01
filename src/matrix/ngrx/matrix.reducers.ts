import * as MatrixActions from './matrix.actions';

export interface State {
    matrixImages: any;
    updateMatrix: boolean;
    pinMode: boolean;
    embedMode: boolean;
    isEmbederShared: boolean;
    pinCollapsed: boolean;
    showLabels: boolean;
    timeUnit: any;
    timeUnits: any[];
    currencyUnit: any;
    currencyUnits: any[];
    incomeFilter: boolean;
    quickGuide: boolean;
    placesSet: Array<any>;
    processImages: boolean;
};

export const initialState: State = {
    matrixImages: null,
    updateMatrix: false,
    pinMode: false,
    embedMode: false,
    isEmbederShared: false,
    pinCollapsed: false,
    showLabels: false,
    timeUnit: null,
    timeUnits: null,
    currencyUnit: null,
    currencyUnits: null,
    incomeFilter: false,
    quickGuide: false,
    placesSet: [],
    processImages: false
};

export function matrixReducer(state: any = initialState, action: MatrixActions.Actions): State {
    switch (action.type) {
        case MatrixActions.UPDATE_MATRIX: {
            return Object.assign({}, state, {updateMatrix: action.payload});
        }

        case MatrixActions.SET_PIN_MODE: {
            return Object.assign({}, state, {placesSet: []}, {pinMode: action.payload});
        }

        /*case MatrixActions.SET_PIN_COLLAPSED: {
            return Object.assign({}, state, {pinCollapsed: action.payload});
        }*/

        case MatrixActions.SET_EMBED_MODE: {
            return Object.assign({}, state, {embedMode: action.payload});
        }

        case MatrixActions.SET_IS_EMBEDED_SHARED: {
          return Object.assign({}, state, {isEmbederShared: action.payload});
        }

        case MatrixActions.OPEN_INCOME_FILTER: {
            return Object.assign({}, state, {incomeFilter: action.payload});
        }

        case MatrixActions.OPEN_QUICK_GUIDE: {
            return Object.assign({}, state, {quickGuide: action.payload});
        }

        case MatrixActions.ADD_PLACE_TO_SET: {
            return Object.assign({}, state, {placesSet: [...state.placesSet, action.payload].sort((a, b) => a.income > b.income ? 1 : -1)});
        }

        case MatrixActions.REMOVE_PLACE_FROM_SET: {
            return Object.assign({}, state, {placesSet: <Array<any>> state.placesSet.filter(place => place._id !== action.payload._id)});
        }

        case MatrixActions.SET_PINNED_PLACES: {
            return Object.assign({}, state, {placesSet: action.payload});
        }

        case MatrixActions.GET_PINNED_PLACES_SUCCESS: {
            return Object.assign({}, state, {placesSet: action.payload});
        }

        case MatrixActions.SET_MATRIX_IMAGES: {
            return Object.assign({}, state, {matrixImages: action.payload});
        }

        case MatrixActions.GET_MATRIX_IMAGES_SUCCESS: {
            return Object.assign({}, state, {matrixImages: action.payload});
        }

        case MatrixActions.SET_SHOW_LABELS: {
            return Object.assign({}, state, {showLabels: action.payload});
        }

        case MatrixActions.SET_TIME_UNIT: {
            return Object.assign({}, state, {timeUnit: action.payload});
        }

        case MatrixActions.GET_TIME_UNITS_SUCCESS: {
            return Object.assign({}, state, {timeUnits: action.payload});
        }

        case MatrixActions.GET_CURRENCY_UNITS_SUCCESS: {
            return Object.assign({}, state, {currencyUnits: action.payload});
        }

        case MatrixActions.SET_CURRENCY_UNIT: {
            return Object.assign({}, state, {currencyUnit: action.payload});
        }

        default:
            return state;
    }
}
