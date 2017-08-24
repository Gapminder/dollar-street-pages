import { Injectable } from "@angular/core";
import { Action } from '@ngrx/store';
import { Effect, Actions, toPayload } from "@ngrx/effects";
import * as CountriesFilterActions from './countries-filter.actions';
import { CountriesFilterService } from '../countries-filter.service';

@Injectable()
export class CountriesFilterEffects {
    constructor(private action$: Actions,
                private countriesFilterService: CountriesFilterService) {
    }

    @Effect()
    getCountriesFilter$ = this.action$
        .ofType(CountriesFilterActions.GET_COUNTRIES_FILTER)
        .map(toPayload)
        .switchMap((query) => this.countriesFilterService.getCountries(query))
        .map(data => data.data)
        .map((data: any) => new CountriesFilterActions.GetCountriesFilterSuccess(data));
}