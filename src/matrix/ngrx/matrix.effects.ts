import { Injectable } from "@angular/core";
import { Action } from '@ngrx/store';
import { Effect, Actions, toPayload } from "@ngrx/effects";
import * as MatrixActions from './matrix.actions';
import { MatrixService } from '../matrix.service';

@Injectable()
export class MatrixEffects {
    constructor(private actions: Actions,
                private matrixService: MatrixService) {
    }

    @Effect()
    getMatrixImages = this.actions
        .ofType(MatrixActions.GET_MATRIX_IMAGES)
        .map(toPayload)
        .switchMap((query: string) => this.matrixService.getMatrixImages(query))
        .map(data => data.data)
        .map((data: any) => new MatrixActions.GetMatrixImagesSuccess(data));
}