import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { Observable } from 'rxjs/Observable';
import { StoreModule } from '@ngrx/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { AppActions } from '../../../app/app.actions';

import {
SharedModule
} from '../../../shared';
import {
MathService,
LoaderService,
BrowserDetectionService,
LanguageService,
UtilsService
} from '../../../common';
import { MatrixImagesComponent } from '../matrix-images.component';
import { MatrixViewBlockComponent } from '../../matrix-view-block';
import { SortPlacesService } from '../../../common/sort-places/sort-places.service';

import {
  LoaderServiceMock,
  BrowserDetectionServiceMock,
  LanguageServiceMock,
  UtilsServiceMock
} from '../../../test/';

describe('MatrixImagesComponent', () => {
  let component: MatrixImagesComponent;
  let fixture: ComponentFixture<MatrixImagesComponent>;
  const places: Object[] = [
    {
      country: 'Burundi',
      image: '54afea8f993307fb769cc6f4',
      income: 26.99458113,
      incomeQuality: 10,
      isUploaded: true,
      lat: -3.5,
      lng: 30,
      region: 'Africa',
      showIncome: 27,
      _id: '54afe95c80d862d9767cf32e'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        InfiniteScrollModule,
        SharedModule,
        RouterTestingModule,
        StoreModule.forRoot({})
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [MatrixImagesComponent],
      providers: [
        {provide: MathService, useValue: {}},
        // AppActions,
        {provide: LoaderService, useClass: LoaderServiceMock},
        {provide: BrowserDetectionService, useClass: BrowserDetectionServiceMock},
        {provide: LanguageService, useClass: LanguageServiceMock},
        {provide: UtilsService, useClass: UtilsServiceMock},
        {provide: SortPlacesService, useValue: {}},
        {provide: MatrixViewBlockComponent, useClass: MatrixViewBlockComponentMock}
      ]
    });

    fixture = TestBed.createComponent(MatrixImagesComponent);
    component = fixture.componentInstance;

    component.places = Observable.of(places);
  });

  it('ngOnInit()', () => {
    fixture.detectChanges();

    expect(component.getTranslationSubscribe).toBeDefined();
    expect(component.placesSubscribe).toBeDefined();
    expect(component.contentLoadedSubscription).toBeDefined();
    expect(component.appStateSubscription).toBeDefined();
    expect(component.resizeSubscribe).toBeDefined();

    spyOn(component.getTranslationSubscribe, 'unsubscribe');
    spyOn(component.placesSubscribe, 'unsubscribe');
    spyOn(component.contentLoadedSubscription, 'unsubscribe');
    spyOn(component.appStateSubscription, 'unsubscribe');
    spyOn(component.resizeSubscribe, 'unsubscribe');

    component.ngOnDestroy();

    expect(component.getTranslationSubscribe.unsubscribe).toHaveBeenCalled();
    expect(component.placesSubscribe.unsubscribe).toHaveBeenCalled();
    expect(component.contentLoadedSubscription.unsubscribe).toHaveBeenCalled();
    expect(component.appStateSubscription.unsubscribe).toHaveBeenCalled();
    expect(component.resizeSubscribe.unsubscribe).toHaveBeenCalled();
  });

  it('buildTitle()', () => {
    const countries = ['Bangladesh', 'Cambodja', 'Singapour'];

    component.buildTitle({regions: ['World'], countries: countries, thing: 'Families'});

    expect(component.activeCountries).toEqual(countries);
  });
});

class MatrixViewBlockComponentMock {
  element = {
    offsetHeight: 0
  };
}
