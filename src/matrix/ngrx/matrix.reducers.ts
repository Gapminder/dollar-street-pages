import * as MatrixActions from './matrix.actions';

export interface State {
    matrixImages: Array<any>;
    updateMatrix: boolean;
    pinMode: boolean;
    incomeFilter: boolean;
    quickGuide: boolean;
};

export const initialState: State = {
    matrixImages: null,
    updateMatrix: false,
    pinMode: false,
    incomeFilter: false,
    quickGuide: false
};

export function matrixReducer(state: any = initialState, action: MatrixActions.Actions): any {
    switch (action.type) {
        case MatrixActions.GET_MATRIX_IMAGES_SUCCESS:
            return Object.assign({}, state, {matrixImages: action.payload});
////////////////////////
        case MatrixActions.UPDATE_MATRIX: {
            return Object.assign({}, state, {updateMatrix: action.payload});
        }

        case MatrixActions.ACTIVATE_PIN_MODE: {
            return Object.assign({}, state, {pinMode: action.payload});
        }

        case MatrixActions.OPEN_INCOME_FILTER: {
            return Object.assign({}, state, {incomeFilter: action.payload});
        }

        case MatrixActions.OPEN_QUICK_GUIDE: {
            return Object.assign({}, state, {quickGuide: action.payload});
        }
////////////////////////
        default:
            return state;
    }
}
