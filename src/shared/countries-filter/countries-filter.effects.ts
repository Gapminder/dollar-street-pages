import { Injectable } from "@angular/core";
import { Action } from '@ngrx/store';
import { Effect, Actions } from "@ngrx/effects";
import { CountriesFilterActions } from './countries-filter.actions';
import { CountriesFilterService } from './countries-filter.service';

@Injectable()
export class CountriesFilterEffects {
    constructor(private action$: Actions,
                private countriesFilterActions: CountriesFilterActions,
                private countriesFilterService: CountriesFilterService) {
    }

    @Effect()
    getCountriesFilter$ = this.action$
        .ofType(CountriesFilterActions.GET_COUNTRIES_FILTER)
        .map((action: Action) => action.payload)
        .switchMap((query) => this.countriesFilterService.getCountries(query))
        .map(data => data.data)
        .map((data: any) => this.countriesFilterActions.getCountriesFilterSuccess(data));
}