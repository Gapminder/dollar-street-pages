import { Injectable } from "@angular/core";
import { Action } from '@ngrx/store';
import { Effect, Actions } from "@ngrx/effects";
import { ThingsFilterActions } from './things-filter.actions';
import { ThingsFilterService } from './things-filter.service';

@Injectable()
export class ThingsFilterEffects {
    constructor(private action$: Actions,
                private thingsFilterActions: ThingsFilterActions,
                private thingsFilterService: ThingsFilterService) {
    }

    @Effect()
    getThigsFilter$ = this.action$
        .ofType(ThingsFilterActions.GET_THINGS_FILTER)
        .map((action: Action) => action.payload)
        .switchMap((query) => this.thingsFilterService.getThings(query))
        .map(data => data.data)
        .map((data: any) => this.thingsFilterActions.getThingsFilterSuccess(data));
}