import { ActionReducer, Action } from '@ngrx/store';
import { MatrixActions } from './matrix.actions';

export function matrixReducer(state: any, action: Action): any {
    switch (action.type) {
        case MatrixActions.GET_MATRIX_IMAGES_SUCCESS:
            return action.payload;

        default:
            return state;
    }
}
