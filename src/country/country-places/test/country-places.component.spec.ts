import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Angulartics2Module } from 'angulartics2';
import { Observable } from 'rxjs/Observable';
import { CountryPlacesComponent } from '../country-places.component';
import { CountryPlacesService } from '../country-places.service';
import { StoreModule } from '@ngrx/store';
import { TranslateTestingModule } from '../../../test/translateTesting.module';
import { CommonServicesTestingModule } from '../../../test/commonServicesTesting.module';
import { forEach } from 'lodash';

describe('CountryPlacesComponent', () => {
  let fixture: ComponentFixture<CountryPlacesComponent>;
  let component: CountryPlacesComponent;

  const countryPlaces = {
    'success': null,
    'msg': [],
    'data': {
      'country': {'_id': '55ef338d0d2b3c82037884eb'},
      'places': [{
        '_id': '562a5ad68e4d42e761a538ff',
        'income': 1097.552505,
        'family': 'Najam',
        'imageId': '562a5b8dd20568f1614d5dee',
        'thing': 'Family',
        'image': '//static.dollarstreet.org/media/Pakistan 1/image/7cda3510-1fb6-4d0c-b69d-0ee3a250e22d/thumb-7cda3510-1fb6-4d0c-b69d-0ee3a250e22d.jpg',
        'placeId': '562a5ad68e4d42e761a538ff',
        'imagesCount': 174
      }]
    },
    'error': null
  };

  class MockCountryPlacesService {
    public getCountryPlaces(): Observable<any> {
      return Observable.of(countryPlaces);
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        Angulartics2Module,
        TranslateTestingModule,
        StoreModule.forRoot({}),
        CommonServicesTestingModule
      ],
      declarations: [CountryPlacesComponent],
      providers: [
        {provide: CountryPlacesService, useClass: MockCountryPlacesService},
      ]
    });

    fixture = TestBed.createComponent(CountryPlacesComponent);
    component = fixture.componentInstance;
  }));

  it('ngOnInit(), ngOnDestroy()', (() => {
    component.ngOnInit();


    forEach(component.ngSubscriptions, subscription => {
      spyOn(subscription, 'unsubscribe');
    });

    component.ngOnDestroy();

    forEach(component.ngSubscriptions, subscription => {
      expect(subscription.unsubscribe).toHaveBeenCalled();
    });
  }));
});
