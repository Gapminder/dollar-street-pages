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
        { provide: Store, useClass: StoreMock }
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

  it('goToThing() -> NGRX', () => {
    fixture.detectChanges();

    component.goToThing({ empty: false });

    const action = new ThingsFilterActions.GetThingsFilter('thing=undefined&countries=World&regions=World');

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('Integration: go to specific thing will dispatch store', () => {
    const action = new ThingsFilterActions.GetThingsFilter(`thing=${relatedThing.originPlural}&countries=World&regions=World`);
    (window as any).innerWidth = 2000;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('.things-filter-button-content'));
    button.triggerEventHandler('click', null);

    fixture.detectChanges();

    const thingButton = fixture.debugElement.query(By.css('.thing-content'));
    thingButton.triggerEventHandler('click', null);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
