import * as MatrixActions from './matrix.actions';

export interface State {

};

export const initialState: State = {

};

export function matrixReducer(state: any, action: MatrixActions.Actions): any {
    switch (action.type) {
        case MatrixActions.GET_MATRIX_IMAGES_SUCCESS:
            return action.payload;

        default:
            return state;
    }
}
