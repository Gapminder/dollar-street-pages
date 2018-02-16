import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { Angulartics2Module } from 'angulartics2';
import { TranslateLoader, TranslateModule, TranslateStaticLoader } from 'ng2-translate';

import { AppStates } from '../../../interfaces';
import * as ThingsFilterActions from '../ngrx/things-filter.actions';
import { ThingsFilterPipe } from '../things-filter.pipe';
import { ThingsFilterComponent } from '../things-filter.component';
import { CommonServicesTestingModule } from '../../../test/commonServicesTesting.module';
import { UrlParametersService } from "../../../url-parameters/url-parameters.service";
import { UrlParametersServiceMock } from "../../../test/mocks/url-parameters.service.mock";

describe('Component: ThingsFilterComponent', () => {
  let fixture: ComponentFixture<ThingsFilterComponent>;
  let component: ThingsFilterComponent;
  let store: Store<AppStates>;

  const relatedThing = {
    _id: 'related',
    epmty: false,
    icon: '',
    originPlural: 'ppppp',
    plural: 'ppppp',
    thingName: 'ppppp'
  };

  class StoreMock {
    select() {
      return Observable.of({
        query: 'thing=Families&countries=World&regions=World&zoom=4&row=1&lowIncome=26&highIncome=15000&lang=en&currency=&time=MONTH&labels=false&activeHouse=NaN',
        thingsFilter: {
          relatedThings: [
            {
              _id: 'related',
              epmty: false,
              icon: '',
              originPlural: 'ppppp',
              plural: 'ppppp',
              thingName: 'ppppp'
            }
          ],
          thing: {
            icon: '',
            originPlural: 'Wardrobes',
            plural: 'Wardrobes',
            relatedThings: [
              'related'
            ]
          },
          popularThings: [
            relatedThing
          ],
          otherThings: [
            relatedThing
          ]
        }
      });
    }

    dispatch() {
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        Angulartics2Module,
        TranslateModule.forRoot({
          provide: TranslateLoader,
          useFactory: () => new TranslateStaticLoader(null, './assets/i18n', '.json')
        }),
        CommonServicesTestingModule
      ],
      declarations: [
        ThingsFilterComponent,
        ThingsFilterPipe
      ],
      providers: [
        { provide: Store, useClass: StoreMock },
        { provide: UrlParametersService, useClass: UrlParametersServiceMock }
      ]
    });

    fixture = TestBed.createComponent(ThingsFilterComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  });

  it('ngOnInit()', () => {
    fixture.detectChanges();

    expect(component.thingsFilterStateSubscribtion).toBeDefined();
    expect(component.resizeSubscribe).toBeDefined();
  });

});
