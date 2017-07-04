import { Injectable } from "@angular/core";
import { Action } from '@ngrx/store';
import { Effect, Actions } from "@ngrx/effects";
import { StreetSettingsActions } from './street-settings.actions';
import { StreetSettingsService } from './street-settings.service';

@Injectable()
export class StreetSettingsEffects {
    constructor(private action$: Actions,
                private streetSettingsActions: StreetSettingsActions,
                private streetSettingsService: StreetSettingsService) {
    }

    @Effect()
    getThigsFilter$ = this.action$
        .ofType(StreetSettingsActions.NGRX_INIT)
        .map((action: Action) => action.payload)
        .switchMap((query) => this.streetSettingsService.getStreetSettings()
        .map((data: any) => data.data).map((data: any) => this.streetSettingsActions.getStreetSettingsSuccess(data)));
}