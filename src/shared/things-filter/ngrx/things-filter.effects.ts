import { Injectable } from "@angular/core";
import { Action } from '@ngrx/store';
import { Effect, Actions, toPayload } from "@ngrx/effects";
import * as ThingsFilterActions from './things-filter.actions';
import { ThingsFilterService } from '../things-filter.service';

@Injectable()
export class ThingsFilterEffects {
    constructor(private action$: Actions,
                private thingsFilterService: ThingsFilterService) {
    }

    @Effect()
    getThigsFilter$ = this.action$
        .ofType(ThingsFilterActions.GET_THINGS_FILTER)
        .map(toPayload)
        .switchMap((query) => this.thingsFilterService.getThings(query))
        .map(data => data.data)
        .map((data: any) => new ThingsFilterActions.GetThingsFilterSuccess(data));
}