import { TestBed, async, getTestBed, fakeAsync, tick } from '@angular/core/testing';

import { IncomeCalcService } from '../income-calc.service';
import { MathService } from "../..";


describe('IncomeCalcService', () => {

  let incomeCalcService: IncomeCalcService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [IncomeCalcService, MathService]
    });

    TestBed.compileComponents();
    const testBed = getTestBed();
    incomeCalcService = testBed.get(IncomeCalcService);

    }));

  it('calcPlaceIncome() Day', fakeAsync( () => {
    let context = '1.00';
    let response =  '';

    response = incomeCalcService.calcPlaceIncome(30, 'DAY' , '1');

    tick();
    expect(response).toEqual(context);
  }));

  it('calcPlaceIncome() Week', fakeAsync( () => {
    let context = '10.00';
    let response =  '';

    response = incomeCalcService.calcPlaceIncome(40, 'WEEK' , '1');

    tick();
    expect(response).toEqual(context);
  }));

  it('calcPlaceIncome() Month', fakeAsync( () => {
    let context = '50';
    let response =  '';

    response = incomeCalcService.calcPlaceIncome(50, 'MONTH' , '1');

    tick();
    expect(response).toEqual(context);
  }));

  it('calcPlaceIncome() Year', fakeAsync( () => {;
    let context = '120';
    let response =  '';

    response = incomeCalcService.calcPlaceIncome(10, 'YEAR' , '1');

    tick();
    expect(response).toEqual(context);
  }));
});
