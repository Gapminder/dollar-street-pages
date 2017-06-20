import { Store } from '@ngrx/store';
import { Effect, Actions, toPayload } from "@ngrx/effects";

import { Injectable } from "@angular/core";

import { AppActions, setAction } from './app.actions';
import { AppStateInterface, appStateName } from './app.state';
import { EffectStateRel } from './effect-state-relations';

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
        this.storeState = store.select(appStateName);
    }

    public getDataOrDispatch(store: Store<AppStateInterface>, action: string): Promise<any> {
        return new Promise((resolve, reject) => {
            switch (action) {
                case AppEffects.GET_STREET_SETTINGS:
                    this.processGetStreetSettings(store, resolve);
                break;

                default:
                break;
            }
        });
    }

    public processGetStreetSettings(store: Store<AppStateInterface>, cb: Function): void {
        this.processRequest(AppEffects.GET_STREET_SETTINGS, AppActions.SET_STREET_SETTINGS, store, cb);
    }

    public processRequest(getRequest: string, setRequest: string, store: Store<AppStateInterface>, cb: Function): void {
        let storeState: Observable<AppStateInterface> = store.select(appStateName);

        const storeDataKey: string = EffectStateRel[getRequest];

        storeState.subscribe((data: AppStateInterface) => {
            let storeData: any = data[storeDataKey];

            if (!storeData) {
                store.dispatch(setAction(getRequest));

                AppActions.actionsEvent.on(setRequest, (data: any) => {
                    cb(data[storeDataKey]);
                });
            } else {
                cb(storeData);
            }
        });
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