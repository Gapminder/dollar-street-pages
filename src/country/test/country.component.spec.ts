import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { Angulartics2GoogleAnalytics, Angulartics2Module } from 'angulartics2';

import { MathService, TitleHeaderService } from '../../common';
import { CountryComponent } from '../country.component';

import { CommonServicesTestingModule } from '../../test/commonServicesTesting.module';
import { TitleHeaderServiceMock } from '../../test/';
import { TranslateTestingModule } from '../../test/translateTesting.module';

describe('CountryComponent', () => {
  let fixture: ComponentFixture<CountryComponent>;
  let component: CountryComponent;
  let titleHeaderService: TitleHeaderServiceMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),
        TranslateTestingModule,
        StoreModule.forRoot({}),
        CommonServicesTestingModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        CountryComponent
      ],
      providers: [
        {provide: MathService, useValue: {}},
        {provide: TitleHeaderService, useClass: TitleHeaderServiceMock},
        {provide: ActivatedRoute, useClass: ActivatedRouteMock}
      ]
    });

    fixture = TestBed.createComponent(CountryComponent);
    titleHeaderService = TestBed.get(TitleHeaderService);
    component = fixture.componentInstance;
  });

  it('create subscriptions on ngOnInit', () => {
    component.ngOnInit();

    expect(component.queryParamsSubscribe).toBeDefined();
  });

  it('unsibscribe on ngOnDestroy', () => {
    fixture.detectChanges();
    spyOn(component.queryParamsSubscribe, 'unsubscribe');

    component.ngOnDestroy();

    expect(component.queryParamsSubscribe.unsubscribe).toHaveBeenCalled();
  });

  it('set default title on init', () => {
    spyOn(titleHeaderService, 'setTitle');
    fixture.detectChanges();

    expect(titleHeaderService.setTitle).toHaveBeenCalledWith('');
  });

  it('get countryID on init', () => {
    fixture.detectChanges();

    expect(component.countryId).toEqual(expectedCountryID);
  });

  it('setTitle is calling titleHeaderService', () => {
    spyOn(titleHeaderService, 'setTitle');
    fixture.detectChanges();

    component.setTitle('expected title');

    expect(titleHeaderService.setTitle).toHaveBeenCalledWith('expected title');
  });
});

const expectedCountryID = '1';

class ActivatedRouteMock {
  params = Observable.of({id: expectedCountryID});
}
