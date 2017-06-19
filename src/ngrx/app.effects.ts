import { Store } from '@ngrx/store';
import { Effect, Actions, toPayload } from "@ngrx/effects";

import { Injectable } from "@angular/core";

import { AppActions, setAction } from './app.actions';
import { AppStateInterface, appState } from './app.state';

import { StreetSettingsService } from '../common';

import { Observable } from "rxjs";

@Injectable()
export class AppEffects {
    public static GET_STREET_SETTINGS: string = 'GET_STREET_SETTINGS';

    public store: Store<AppStateInterface>;
    public storeState: Observable<AppStateInterface>;

    constructor(private action$: Actions,
                store: Store<AppStateInterface>,
                private streetSettingsService: StreetSettingsService) {
        this.store = store;
        this.storeState = store.select(appState);
    }

    @Effect()
    getStreetSettings$ = this.action$
        .ofType(AppEffects.GET_STREET_SETTINGS)
        .switchMap(() => {
            return this.streetSettingsService.getStreetSettings().map(data => data.data).map((data: any) => {
                this.store.dispatch(setAction(AppActions.SET_STREET_SETTINGS, {streetSettings: data}));
                return data;
            });
        });
}