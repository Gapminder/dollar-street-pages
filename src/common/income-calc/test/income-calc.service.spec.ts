import { TestBed, async, getTestBed, fakeAsync, tick } from '@angular/core/testing';

import { IncomeCalcService } from '../income-calc.service';
import { MathService } from "../..";


describe('IncomeCalcService', () => {

  let incomeCalcService: IncomeCalcService;
  let context: string;
  let response: string;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [IncomeCalcService, MathService]
    });

    TestBed.compileComponents();
    const testBed = getTestBed();
    incomeCalcService = testBed.get(IncomeCalcService);

    }));

  it('calcPlaceIncome() Day', fakeAsync( () => {
    context = '1.00';
    response = incomeCalcService.calcPlaceIncome(30, 'DAY' , '1');

    tick();
    expect(response).toEqual(context);
  }));

  it('calcPlaceIncome() Week', fakeAsync( () => {
    context = '10.00';
    response = incomeCalcService.calcPlaceIncome(40, 'WEEK' , '1');

    tick();
    expect(response).toEqual(context);
  }));

  it('calcPlaceIncome() Month', fakeAsync( () => {
    context = '50';
    response = incomeCalcService.calcPlaceIncome(50, 'MONTH' , '1');

    tick();
    expect(response).toEqual(context);
  }));

  it('calcPlaceIncome() Year', fakeAsync( () => {;
    context = '120';
    response = incomeCalcService.calcPlaceIncome(10, 'YEAR' , '1');

    tick();
    expect(response).toEqual(context);
  }));
});
