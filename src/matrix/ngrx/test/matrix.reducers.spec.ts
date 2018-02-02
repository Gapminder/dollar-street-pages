import * as fromMatrixActions from '../matrix.actions';
import * as fromMatrixReducers from '../matrix.reducers';
import { Currency, Place, TimeUnit } from '../../../interfaces';

describe('Matrix Reducers', () => {

  it('should return default state', () => {
    const {initialState} = fromMatrixReducers;
    const action = {} as any;
    const state = fromMatrixReducers.matrixReducer(undefined, action);

    expect(state).toBe(initialState);
  });

  it('UpdateMatrix in state', () => {
    const payload = true;
    const {initialState} = fromMatrixReducers;
    const action = new fromMatrixActions.UpdateMatrix(payload);
    const state = fromMatrixReducers.matrixReducer(initialState, action);

    expect(state.updateMatrix).toEqual(payload);

    // everything else the same
    expect(state.pinMode).toEqual(false);
    expect(state.embedMode).toEqual(false);
    expect(state.isEmbederShared).toEqual(false);
    expect(state.pinCollapsed).toEqual(false);
    expect(state.showLabels).toEqual(false);
    expect(state.incomeFilter).toEqual(false);
    expect(state.quickGuide).toEqual(false);
    expect(state.processImages).toEqual(false);
    expect(state.matrixImages).toEqual(null);
    expect(state.timeUnit).toEqual(null);
    expect(state.timeUnits).toEqual(null);
    expect(state.currencyUnit).toEqual(null);
    expect(state.currencyUnits).toEqual(null);
    expect(state.placesSet).toEqual([]);
  });

  it('SetPinMode in state', () => {
    const payload = true;
    const {initialState} = fromMatrixReducers;
    const action = new fromMatrixActions.SetPinMode(payload);
    const state = fromMatrixReducers.matrixReducer(initialState, action);

    expect(state.pinMode).toEqual(payload);

    // everything else the same
    expect(state.updateMatrix).toEqual(false);
    expect(state.embedMode).toEqual(false);
    expect(state.isEmbederShared).toEqual(false);
    expect(state.pinCollapsed).toEqual(false);
    expect(state.showLabels).toEqual(false);
    expect(state.incomeFilter).toEqual(false);
    expect(state.quickGuide).toEqual(false);
    expect(state.processImages).toEqual(false);
    expect(state.matrixImages).toEqual(null);
    expect(state.timeUnit).toEqual(null);
    expect(state.timeUnits).toEqual(null);
    expect(state.currencyUnit).toEqual(null);
    expect(state.currencyUnits).toEqual(null);
    expect(state.placesSet).toEqual([]);
  });

  it('SetEmbedMode in state', () => {
    const payload = true;
    const {initialState} = fromMatrixReducers;
    const action = new fromMatrixActions.SetEmbedMode(payload);
    const state = fromMatrixReducers.matrixReducer(initialState, action);

    expect(state.embedMode).toEqual(payload);

    // everything else the same
    expect(state.updateMatrix).toEqual(false);
    expect(state.pinMode).toEqual(false);
    expect(state.isEmbederShared).toEqual(false);
    expect(state.pinCollapsed).toEqual(false);
    expect(state.showLabels).toEqual(false);
    expect(state.incomeFilter).toEqual(false);
    expect(state.quickGuide).toEqual(false);
    expect(state.processImages).toEqual(false);
    expect(state.matrixImages).toEqual(null);
    expect(state.timeUnit).toEqual(null);
    expect(state.timeUnits).toEqual(null);
    expect(state.currencyUnit).toEqual(null);
    expect(state.currencyUnits).toEqual(null);
    expect(state.placesSet).toEqual([]);
  });

  it('SetIsEmbededShared in state', () => {
    const payload = true;
    const {initialState} = fromMatrixReducers;
    const action = new fromMatrixActions.SetIsEmbededShared(payload);
    const state = fromMatrixReducers.matrixReducer(initialState, action);

    expect(state.isEmbederShared).toEqual(payload);

    // everything else the same
    expect(state.updateMatrix).toEqual(false);
    expect(state.pinMode).toEqual(false);
    expect(state.embedMode).toEqual(false);
    expect(state.pinCollapsed).toEqual(false);
    expect(state.showLabels).toEqual(false);
    expect(state.incomeFilter).toEqual(false);
    expect(state.quickGuide).toEqual(false);
    expect(state.processImages).toEqual(false);
    expect(state.matrixImages).toEqual(null);
    expect(state.timeUnit).toEqual(null);
    expect(state.timeUnits).toEqual(null);
    expect(state.currencyUnit).toEqual(null);
    expect(state.currencyUnits).toEqual(null);
    expect(state.placesSet).toEqual([]);
  });

  it('OpenIncomeFilter in state', () => {
    const payload = true;
    const {initialState} = fromMatrixReducers;
    const action = new fromMatrixActions.OpenIncomeFilter(payload);
    const state = fromMatrixReducers.matrixReducer(initialState, action);

    expect(state.incomeFilter).toEqual(payload);

    // everything else the same
    expect(state.updateMatrix).toEqual(false);
    expect(state.pinMode).toEqual(false);
    expect(state.embedMode).toEqual(false);
    expect(state.isEmbederShared).toEqual(false);
    expect(state.pinCollapsed).toEqual(false);
    expect(state.showLabels).toEqual(false);
    expect(state.quickGuide).toEqual(false);
    expect(state.processImages).toEqual(false);
    expect(state.matrixImages).toEqual(null);
    expect(state.timeUnit).toEqual(null);
    expect(state.timeUnits).toEqual(null);
    expect(state.currencyUnit).toEqual(null);
    expect(state.currencyUnits).toEqual(null);
    expect(state.placesSet).toEqual([]);
  });

  it('OpenQuickGuide in state', () => {
    const payload = true;
    const {initialState} = fromMatrixReducers;
    const action = new fromMatrixActions.OpenQuickGuide(payload);
    const state = fromMatrixReducers.matrixReducer(initialState, action);

    expect(state.quickGuide).toEqual(payload);

    // everything else the same
    expect(state.updateMatrix).toEqual(false);
    expect(state.pinMode).toEqual(false);
    expect(state.embedMode).toEqual(false);
    expect(state.isEmbederShared).toEqual(false);
    expect(state.pinCollapsed).toEqual(false);
    expect(state.showLabels).toEqual(false);
    expect(state.incomeFilter).toEqual(false);
    expect(state.processImages).toEqual(false);
    expect(state.matrixImages).toEqual(null);
    expect(state.timeUnit).toEqual(null);
    expect(state.timeUnits).toEqual(null);
    expect(state.currencyUnit).toEqual(null);
    expect(state.currencyUnits).toEqual(null);
    expect(state.placesSet).toEqual([]);
  });

  it('AddPlaceToSet should add an item to placesSet array', () => {
    const {initialState} = fromMatrixReducers;
    const action = new fromMatrixActions.AddPlaceToSet(places[0]);
    const state = fromMatrixReducers.matrixReducer(initialState, action);

    expect(state.placesSet.length).toEqual(1);
    expect(state.placesSet).toEqual([places[0]]);

    // everything else the same
    expect(state.updateMatrix).toEqual(false);
    expect(state.pinMode).toEqual(false);
    expect(state.embedMode).toEqual(false);
    expect(state.isEmbederShared).toEqual(false);
    expect(state.pinCollapsed).toEqual(false);
    expect(state.showLabels).toEqual(false);
    expect(state.incomeFilter).toEqual(false);
    expect(state.quickGuide).toEqual(false);
    expect(state.processImages).toEqual(false);
    expect(state.matrixImages).toEqual(null);
    expect(state.timeUnit).toEqual(null);
    expect(state.timeUnits).toEqual(null);
    expect(state.currencyUnit).toEqual(null);
    expect(state.currencyUnits).toEqual(null);
  });

  it('RemovePlaceFromSet should remove an item from placesSet array', () => {
    const {initialState} = fromMatrixReducers;
    let previousState = {...initialState};
    previousState.placesSet = places;

    const action = new fromMatrixActions.RemovePlaceFromSet(places[0]);
    const state = fromMatrixReducers.matrixReducer(previousState, action);

    expect(state.placesSet.length).toEqual(1);
    expect(state.placesSet).toEqual([places[1]]);

    // everything else the same
    expect(state.updateMatrix).toEqual(false);
    expect(state.pinMode).toEqual(false);
    expect(state.embedMode).toEqual(false);
    expect(state.isEmbederShared).toEqual(false);
    expect(state.pinCollapsed).toEqual(false);
    expect(state.showLabels).toEqual(false);
    expect(state.incomeFilter).toEqual(false);
    expect(state.quickGuide).toEqual(false);
    expect(state.processImages).toEqual(false);
    expect(state.matrixImages).toEqual(null);
    expect(state.timeUnit).toEqual(null);
    expect(state.timeUnits).toEqual(null);
    expect(state.currencyUnit).toEqual(null);
    expect(state.currencyUnits).toEqual(null);
  });

  it('SetPinnedPlaces should add placesSet', () => {
    const payload = places;
    const {initialState} = fromMatrixReducers;
    const action = new fromMatrixActions.SetPinnedPlaces(payload);
    const state = fromMatrixReducers.matrixReducer(initialState, action);

    expect(state.placesSet).toEqual(places);

    // everything else the same
    expect(state.updateMatrix).toEqual(false);
    expect(state.pinMode).toEqual(false);
    expect(state.embedMode).toEqual(false);
    expect(state.isEmbederShared).toEqual(false);
    expect(state.pinCollapsed).toEqual(false);
    expect(state.showLabels).toEqual(false);
    expect(state.incomeFilter).toEqual(false);
    expect(state.quickGuide).toEqual(false);
    expect(state.processImages).toEqual(false);
    expect(state.matrixImages).toEqual(null);
    expect(state.timeUnit).toEqual(null);
    expect(state.timeUnits).toEqual(null);
    expect(state.currencyUnit).toEqual(null);
    expect(state.currencyUnits).toEqual(null);
  });

  it('GetPinnedPlacesSuccess should return placesSet', () => {
    const payload = places;
    const {initialState} = fromMatrixReducers;
    const action = new fromMatrixActions.GetPinnedPlacesSuccess(payload);
    const state = fromMatrixReducers.matrixReducer(initialState, action);

    expect(state.placesSet).toEqual(places);

    // everything else the same
    expect(state.updateMatrix).toEqual(false);
    expect(state.pinMode).toEqual(false);
    expect(state.embedMode).toEqual(false);
    expect(state.isEmbederShared).toEqual(false);
    expect(state.pinCollapsed).toEqual(false);
    expect(state.showLabels).toEqual(false);
    expect(state.incomeFilter).toEqual(false);
    expect(state.quickGuide).toEqual(false);
    expect(state.processImages).toEqual(false);
    expect(state.matrixImages).toEqual(null);
    expect(state.timeUnit).toEqual(null);
    expect(state.timeUnits).toEqual(null);
    expect(state.currencyUnit).toEqual(null);
    expect(state.currencyUnits).toEqual(null);
  });

  it('SetMatrixImages return matrixImages', () => {
    const payload = [];
    const {initialState} = fromMatrixReducers;
    const action = new fromMatrixActions.SetMatrixImages(payload);
    const state = fromMatrixReducers.matrixReducer(initialState, action);

    expect(state.matrixImages).toEqual(payload);

    // everything else the same
    expect(state.updateMatrix).toEqual(false);
    expect(state.pinMode).toEqual(false);
    expect(state.embedMode).toEqual(false);
    expect(state.isEmbederShared).toEqual(false);
    expect(state.pinCollapsed).toEqual(false);
    expect(state.showLabels).toEqual(false);
    expect(state.incomeFilter).toEqual(false);
    expect(state.quickGuide).toEqual(false);
    expect(state.processImages).toEqual(false);
    expect(state.timeUnit).toEqual(null);
    expect(state.timeUnits).toEqual(null);
    expect(state.currencyUnit).toEqual(null);
    expect(state.currencyUnits).toEqual(null);
    expect(state.placesSet).toEqual([]);
  });

  it('GetMatrixImagesSuccess return matrixImages', () => {
    const payload = [];
    const {initialState} = fromMatrixReducers;
    const action = new fromMatrixActions.GetMatrixImagesSuccess(payload);
    const state = fromMatrixReducers.matrixReducer(initialState, action);

    expect(state.matrixImages).toEqual(payload);

    // everything else the same
    expect(state.updateMatrix).toEqual(false);
    expect(state.pinMode).toEqual(false);
    expect(state.embedMode).toEqual(false);
    expect(state.isEmbederShared).toEqual(false);
    expect(state.pinCollapsed).toEqual(false);
    expect(state.showLabels).toEqual(false);
    expect(state.incomeFilter).toEqual(false);
    expect(state.quickGuide).toEqual(false);
    expect(state.processImages).toEqual(false);
    expect(state.timeUnit).toEqual(null);
    expect(state.timeUnits).toEqual(null);
    expect(state.currencyUnit).toEqual(null);
    expect(state.currencyUnits).toEqual(null);
    expect(state.placesSet).toEqual([]);
  });

  it('SetShowLabels add in state', () => {
    const payload = true;
    const {initialState} = fromMatrixReducers;
    const action = new fromMatrixActions.SetShowLabels(payload);
    const state = fromMatrixReducers.matrixReducer(initialState, action);

    expect(state.showLabels).toEqual(payload);

    // everything else the same
    expect(state.updateMatrix).toEqual(false);
    expect(state.matrixImages).toEqual(null);
    expect(state.pinMode).toEqual(false);
    expect(state.embedMode).toEqual(false);
    expect(state.isEmbederShared).toEqual(false);
    expect(state.pinCollapsed).toEqual(false);
    expect(state.incomeFilter).toEqual(false);
    expect(state.quickGuide).toEqual(false);
    expect(state.processImages).toEqual(false);
    expect(state.timeUnit).toEqual(null);
    expect(state.timeUnits).toEqual(null);
    expect(state.currencyUnit).toEqual(null);
    expect(state.currencyUnits).toEqual(null);
    expect(state.placesSet).toEqual([]);
  });

  it('SetTimeUnit return timeUnit', () => {
    const payload = timeUnit;
    const {initialState} = fromMatrixReducers;
    const action = new fromMatrixActions.SetTimeUnit(payload);
    const state = fromMatrixReducers.matrixReducer(initialState, action);

    expect(state.timeUnit).toEqual(payload);

    // everything else the same
    expect(state.updateMatrix).toEqual(false);
    expect(state.pinMode).toEqual(false);
    expect(state.embedMode).toEqual(false);
    expect(state.isEmbederShared).toEqual(false);
    expect(state.pinCollapsed).toEqual(false);
    expect(state.showLabels).toEqual(false);
    expect(state.incomeFilter).toEqual(false);
    expect(state.quickGuide).toEqual(false);
    expect(state.processImages).toEqual(false);
    expect(state.matrixImages).toEqual(null);
    expect(state.timeUnits).toEqual(null);
    expect(state.currencyUnit).toEqual(null);
    expect(state.currencyUnits).toEqual(null);
    expect(state.placesSet).toEqual([]);
  });

  it('GetTimeUnitsSuccess return timeUnit', () => {
    const payload = [timeUnit];
    const {initialState} = fromMatrixReducers;
    const action = new fromMatrixActions.GetTimeUnitsSuccess(payload);
    const state = fromMatrixReducers.matrixReducer(initialState, action);

    expect(state.timeUnits).toEqual(payload);

    // everything else the same
    expect(state.updateMatrix).toEqual(false);
    expect(state.pinMode).toEqual(false);
    expect(state.embedMode).toEqual(false);
    expect(state.isEmbederShared).toEqual(false);
    expect(state.pinCollapsed).toEqual(false);
    expect(state.showLabels).toEqual(false);
    expect(state.incomeFilter).toEqual(false);
    expect(state.quickGuide).toEqual(false);
    expect(state.processImages).toEqual(false);
    expect(state.matrixImages).toEqual(null);
    expect(state.timeUnit).toEqual(null);
    expect(state.currencyUnit).toEqual(null);
    expect(state.currencyUnits).toEqual(null);
    expect(state.placesSet).toEqual([]);
  });

  it('GetCurrencyUnitsSuccess return currency units', () => {
    const payload = [currency];
    const {initialState} = fromMatrixReducers;
    const action = new fromMatrixActions.GetCurrencyUnitsSuccess(payload);
    const state = fromMatrixReducers.matrixReducer(initialState, action);

    expect(state.currencyUnits).toEqual(payload);

    // everything else the same
    expect(state.updateMatrix).toEqual(false);
    expect(state.pinMode).toEqual(false);
    expect(state.embedMode).toEqual(false);
    expect(state.isEmbederShared).toEqual(false);
    expect(state.pinCollapsed).toEqual(false);
    expect(state.showLabels).toEqual(false);
    expect(state.incomeFilter).toEqual(false);
    expect(state.quickGuide).toEqual(false);
    expect(state.processImages).toEqual(false);
    expect(state.matrixImages).toEqual(null);
    expect(state.timeUnit).toEqual(null);
    expect(state.timeUnits).toEqual(null);
    expect(state.currencyUnit).toEqual(null);
    expect(state.placesSet).toEqual([]);
  });

  it('SetCurrencyUnit should set currency', () => {
    const payload = currency;
    const {initialState} = fromMatrixReducers;
    const action = new fromMatrixActions.SetCurrencyUnit(payload);
    const state = fromMatrixReducers.matrixReducer(initialState, action);

    expect(state.currencyUnit).toEqual(payload);

    // everything else the same
    expect(state.updateMatrix).toEqual(false);
    expect(state.pinMode).toEqual(false);
    expect(state.embedMode).toEqual(false);
    expect(state.isEmbederShared).toEqual(false);
    expect(state.pinCollapsed).toEqual(false);
    expect(state.showLabels).toEqual(false);
    expect(state.incomeFilter).toEqual(false);
    expect(state.quickGuide).toEqual(false);
    expect(state.processImages).toEqual(false);
    expect(state.matrixImages).toEqual(null);
    expect(state.timeUnit).toEqual(null);
    expect(state.timeUnits).toEqual(null);
    expect(state.currencyUnits).toEqual(null);
    expect(state.placesSet).toEqual([]);
  });
});


const places: Place[] = [
  {
    background: 'string',
    country: 'string',
    image: 'string',
    income: 1,
    incomeQuality: 1,
    isUploaded: true,
    lat: 1,
    lng: 1,
    region: 'World',
    showIncome: 2,
    _id: '22'
  },
  {
    background: 'string',
    country: 'string',
    image: 'string',
    income: 1,
    incomeQuality: 1,
    isUploaded: true,
    lat: 1,
    lng: 1,
    region: 'World',
    showIncome: 2,
    _id: '33'
  }
];

const timeUnit: TimeUnit = {
  code: 'code',
  name: 'name',
  per: 'per'
};

const currency: Currency = {
  currency: 'currency',
  code: 'code',
  value: 1,
  symbol: 'symbol',
  updated: 1,
  translations: [{}]
};
