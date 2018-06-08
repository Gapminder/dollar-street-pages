import * as fromStreetActoins from '../street-settings.actions';
import { DrawDividersInterface } from '../../../../interfaces';

describe('Street-settings actions', () => {

  describe('GetStreetSettings', () => {
    it('should create action', () => {
      const action = new fromStreetActoins.GetStreetSettings();

      expect({...action}).toEqual({
        type: fromStreetActoins.GET_STREET_SETTINGS
      });
    });
  });

  describe('GetStreetSettingSuccess', () => {
    it('should create action', () => {
      const action = new fromStreetActoins.GetStreetSettingsSuccess(payload);

      expect({...action}).toEqual({
        type: fromStreetActoins.GET_STREET_SETTINGS_SUCCESS,
        payload
      });
    });
  });

  describe('SetStreetSetting', () => {
    it('should create action', () => {
      const action = new fromStreetActoins.SetStreetSettings(payload);

      expect({...action}).toEqual({
        type: fromStreetActoins.SET_STREET_SETTINGS,
        payload
      });
    });
  });

});

const payload: DrawDividersInterface = {
  showDividers: true,
  low: 1,
  medium: 2,
  high: 3,
  poor: 4,
  rich: 5,
  lowDividerCoord: 5,
  mediumDividerCoord: 6,
  highDividerCoord: 7,
  dividers: [1, 2, 3]
};
