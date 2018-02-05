import { Injectable } from '@angular/core';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import * as StreetSettingsActions from './street-settings.actions';
import { StreetSettingsService } from '../street-settings.service';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class StreetSettingsEffects {
    constructor(private action$: Actions,
                private streetSettingsService: StreetSettingsService) {
    }

    @Effect()
    getStreetSettings$ = this.action$
        .ofType(StreetSettingsActions.GET_STREET_SETTINGS)
        .map((action: StreetSettingsActions.GetStreetSettingsSuccess) => action.payload)
        .switchMap((query) => this.streetSettingsService.getStreetSettings()
        .map((data: any) => data.data).map((data: any) => new StreetSettingsActions.GetStreetSettingsSuccess(data)));
}
