import * as fromMatrixActions from '../matrix.actions';
import { Currency, TimeUnit } from '../../../interfaces';

describe('Matrix actions', () => {

  describe('Should create action', () => {
    it('UpdateMatrix', () => {
      const payload = true;
      const action = new fromMatrixActions.UpdateMatrix(payload);

      expect({...action}).toEqual({
        type: fromMatrixActions.UPDATE_MATRIX,
        payload
      });
    });

    it('SetPinMode', () => {
      const payload = true;
      const action = new fromMatrixActions.SetPinMode(payload);

      expect({...action}).toEqual({
        type: fromMatrixActions.SET_PIN_MODE,
        payload
      });
    });

    it('SetIsEmbededShared', () => {
      const payload = true;
      const action = new fromMatrixActions.SetIsEmbededShared(payload);

      expect({...action}).toEqual({
        type: fromMatrixActions.SET_IS_EMBEDED_SHARED,
        payload
      });
    });

    it('SetEmbedMode', () => {
      const payload = true;
      const action = new fromMatrixActions.SetEmbedMode(payload);

      expect({...action}).toEqual({
        type: fromMatrixActions.SET_EMBED_MODE,
        payload
      });
    });

    it('SetTimeUnit', () => {
      const payload: TimeUnit = {
        code: 'code',
        name: 'name',
        per: 'per'
      };
      const action = new fromMatrixActions.SetTimeUnit(payload);

      expect({...action}).toEqual({
        type: fromMatrixActions.SET_TIME_UNIT,
        payload
      });
    });

    it('OpenIncomeFilter', () => {
      const payload = true;
      const action = new fromMatrixActions.OpenIncomeFilter(payload);

      expect({...action}).toEqual({
        type: fromMatrixActions.OPEN_INCOME_FILTER,
        payload
      });
    });

    it('OpenQuickGuide', () => {
      const payload = true;
      const action = new fromMatrixActions.OpenQuickGuide(payload);

      expect({...action}).toEqual({
        type: fromMatrixActions.OPEN_QUICK_GUIDE,
        payload
      });
    });

    it('AddPlaceToSet', () => {
      const payload = true;
      const action = new fromMatrixActions.AddPlaceToSet(payload);

      expect({...action}).toEqual({
        type: fromMatrixActions.ADD_PLACE_TO_SET,
        payload
      });
    });

    it('RemovePlaceFromSet', () => {
      const payload = 'any';
      const action = new fromMatrixActions.RemovePlaceFromSet(payload);

      expect({...action}).toEqual({
        type: fromMatrixActions.REMOVE_PLACE_FROM_SET,
        payload
      });
    });

    it('GetPinnedPlaces', () => {
      const payload = 'any';
      const action = new fromMatrixActions.GetPinnedPlaces(payload);

      expect({...action}).toEqual({
        type: fromMatrixActions.GET_PINNED_PLACES,
        payload
      });
    });

    it('GetPinnedPlacesSuccess', () => {
      const payload = 'any';
      const action = new fromMatrixActions.GetPinnedPlacesSuccess(payload);

      expect({...action}).toEqual({
        type: fromMatrixActions.GET_PINNED_PLACES_SUCCESS,
        payload
      });
    });

    it('SetPinnedPlaces', () => {
      const payload = 'any';
      const action = new fromMatrixActions.SetPinnedPlaces(payload);

      expect({...action}).toEqual({
        type: fromMatrixActions.SET_PINNED_PLACES,
        payload
      });
    });

    it('GetMatrixImages', () => {
      const payload = 'string';
      const action = new fromMatrixActions.GetMatrixImages(payload);

      expect({...action}).toEqual({
        type: fromMatrixActions.GET_MATRIX_IMAGES,
        payload
      });
    });

    it('SetMatrixImages', () => {
      const payload = 'any';
      const action = new fromMatrixActions.SetMatrixImages(payload);

      expect({...action}).toEqual({
        type: fromMatrixActions.SET_MATRIX_IMAGES,
        payload
      });
    });

    it('GetMatrixImagesSuccess', () => {
      const payload = 'any';
      const action = new fromMatrixActions.GetMatrixImagesSuccess(payload);

      expect({...action}).toEqual({
        type: fromMatrixActions.GET_MATRIX_IMAGES_SUCCESS,
        payload
      });
    });

    it('SetShowLabels', () => {
      const payload = true;
      const action = new fromMatrixActions.SetShowLabels(payload);

      expect({...action}).toEqual({
        type: fromMatrixActions.SET_SHOW_LABELS,
        payload
      });
    });

    it('GetTimeUnits', () => {
      const action = new fromMatrixActions.GetTimeUnits();

      expect({...action}).toEqual({
        type: fromMatrixActions.GET_TIME_UNITS
      });
    });

    it('GetTimeUnitsSuccess', () => {
      const payload = 'any';
      const action = new fromMatrixActions.GetTimeUnitsSuccess(payload);

      expect({...action}).toEqual({
        type: fromMatrixActions.GET_TIME_UNITS_SUCCESS,
        payload
      });
    });

    it('GetCurrencyUnits', () => {
      const action = new fromMatrixActions.GetCurrencyUnits();

      expect({...action}).toEqual({
        type: fromMatrixActions.GET_CURRENCY_UNITS
      });
    });

    it('GetCurrencyUnitsSuccess', () => {
      const payload: Currency[] = [
        {
          currency: 'string',
          code: 'string',
          value: 1,
          symbol: 'string',
          updated: 1,
          translations: [{}]
        }
      ];
      const action = new fromMatrixActions.GetCurrencyUnitsSuccess(payload);

      expect({...action}).toEqual({
        type: fromMatrixActions.GET_CURRENCY_UNITS_SUCCESS,
        payload
      });
    });

    it('SetCurrencyUnit', () => {
      const payload: Currency = {
        currency: 'string',
        code: 'string',
        value: 1,
        symbol: 'string',
        updated: 1,
        translations: [{}]
      };
      const action = new fromMatrixActions.SetCurrencyUnit(payload);

      expect({...action}).toEqual({
        type: fromMatrixActions.SET_CURRENCY_UNIT,
        payload
      });
    });
  });
});
