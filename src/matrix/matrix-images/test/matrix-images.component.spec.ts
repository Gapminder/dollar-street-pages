import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { Observable } from 'rxjs/Observable';
import { StoreModule } from '@ngrx/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatrixImagesComponent } from '../matrix-images.component';
import { SortPlacesService } from '../../../common/sort-places/sort-places.service';
import { Place } from '../../../interfaces';
import { CommonServicesTestingModule } from '../../../test/commonServicesTesting.module';
import { MatrixService } from '../../matrix.service';
import { MatrixServiceMock } from '../../../test/mocks/matrixService.service.mock';

describe('MatrixImagesComponent', () => {
  let component: MatrixImagesComponent;
  let fixture: ComponentFixture<MatrixImagesComponent>;
  const places: Place[] = [
    {
      background: '',
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
        RouterTestingModule,
        StoreModule.forRoot({}),
        CommonServicesTestingModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [MatrixImagesComponent],
      providers: [
        { provide: SortPlacesService, useValue: {} },
        { provide: MatrixService, useClass: MatrixServiceMock }
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
    expect(component.viewChildrenSubscription).toBeDefined();
    expect(component.contentLoadedSubscription).toBeDefined();
    expect(component.matrixStateSubscription).toBeDefined();
    expect(component.resizeSubscribe).toBeDefined();

    spyOn(component.getTranslationSubscribe, 'unsubscribe');
    spyOn(component.placesSubscribe, 'unsubscribe');
    spyOn(component.viewChildrenSubscription, 'unsubscribe');
    spyOn(component.contentLoadedSubscription, 'unsubscribe');
    spyOn(component.matrixStateSubscription, 'unsubscribe');
    spyOn(component.resizeSubscribe, 'unsubscribe');


    component.ngOnDestroy();

    expect(component.getTranslationSubscribe.unsubscribe).toHaveBeenCalled();
    expect(component.placesSubscribe.unsubscribe).toHaveBeenCalled();
    expect(component.viewChildrenSubscription.unsubscribe).toHaveBeenCalled();
    expect(component.contentLoadedSubscription.unsubscribe).toHaveBeenCalled();
    expect(component.matrixStateSubscription.unsubscribe).toHaveBeenCalled();
    expect(component.resizeSubscribe.unsubscribe).toHaveBeenCalled();

  });

  it('buildTitle()', () => {
    const query = {
      regions: ['World'],
      countries: ['Bangladesh', 'Cambodja', 'Singapour'],
      thing: 'Families'
    };

    component.buildTitle(query);

    expect(component.activeCountries).toEqual(query.countries);
  });
});

class MatrixViewBlockComponentMock {
  element = {
    offsetHeight: 0
  };
}
