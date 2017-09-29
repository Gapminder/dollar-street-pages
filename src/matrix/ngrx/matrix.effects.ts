import { Injectable } from "@angular/core";
import { Action } from '@ngrx/store';
import { Effect, Actions, toPayload } from "@ngrx/effects";
import * as MatrixActions from './matrix.actions';
import { MatrixService } from '../matrix.service';
import { Observable } from 'rxjs';

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

    @Effect()
    getPinnedPlaces = this.actions
        .ofType(MatrixActions.GET_PINNED_PLACES)
        .map(toPayload)
        .switchMap((query: string) => this.matrixService.getPinnedPlaces(query))
        .map(data => data.data)
        .map((data: any) => new MatrixActions.GetPinnedPlacesSuccess(data.places));

    @Effect()
    getTimeUnits = this.actions
        .ofType(MatrixActions.GET_TIME_UNITS)
        .map(toPayload)
        .switchMap(() => Observable.of({data: [
          {code: 'DAY', name: 'Day', name1: 'Daily income', per: 'day'},
          {code: 'WEEK', name: 'Week', name1: 'Weekly income', per: 'week'},
          {code: 'MONTH', name: 'Month', name1: 'Monthly income', per: 'month'},
          {code: 'YEAR', name: 'Year', name1: 'Yearly income', per: 'year'}
        ]}))
        .map(data => data.data)
        .map((data: any) => new MatrixActions.GetTimeUnitsSuccess(data));

    @Effect()
    getCurrencyUnits = this.actions
        .ofType(MatrixActions.GET_CURRENCY_UNITS)
        .map(toPayload)
        .switchMap(() => this.matrixService.getCurrencyUnits())
        .map(data => data.data)
        .map((data: any) => new MatrixActions.GetCurrencyUnitsSuccess(data));
}
