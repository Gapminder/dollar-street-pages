import { Injectable } from "@angular/core";
import { Action } from '@ngrx/store';
import { Effect, Actions, toPayload } from "@ngrx/effects";
import { AppActions } from './app.actions';
import { StreetSettingsService } from '../common';

@Injectable()
export class AppEffects {
    constructor(private action$: Actions,
                private appActions: AppActions,
                private streetSettingsService: StreetSettingsService) {
    }

    @Effect()
    getStreetSettings$ = this.action$
        .ofType(AppActions.GET_STREET_SETTINGS)
        .map((action: Action) => action.payload)
        .switchMap(() => this.streetSettingsService.getStreetSettings())
        .map(data => data.data).map((data: any) => this.appActions.getStreetSettingsSuccess(data));
}