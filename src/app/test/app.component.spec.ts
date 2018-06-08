import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import { AppStates } from '../../interfaces';
import {
  FontDetectorService,
  GoogleAnalyticsService,
  LocalStorageService,
  MathService,
  SocialShareService
} from '../../common';
import { SocialShareServiceMock } from '../../test/';
import { AppComponent } from '../app.component';
import { TranslateTestingModule } from '../../test/translateTesting.module';
import { CommonServicesTestingModule } from '../../test/commonServicesTesting.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { forEach } from 'lodash';
import { Subscription } from 'rxjs/Subscription';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let store: Store<AppStates>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StoreModule.forRoot({}),
        TranslateTestingModule,
        CommonServicesTestingModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        AppComponent
      ],
      providers: [
        {provide: FontDetectorService, useValue: {}},
        {provide: GoogleAnalyticsService, useValue: {}},
        {provide: MathService, useValue: {}},
        {provide: LocalStorageService, useValue: {}},
        {provide: SocialShareService, useClass: SocialShareServiceMock}
      ]
    });

    fixture = TestBed.createComponent(AppComponent);
    // fixture.detectChanges();
    component = fixture.componentInstance;
    // store = TestBed.get(Store);

    // spyOn(store, 'dispatch').and.callThrough();
  }));

  it('ngOnInit(), ngOnDestroy()', () => {
    component.ngOnInit();

    forEach(component.ngSubscriptions, (subscription: Subscription) => {
      spyOn(subscription, 'unsubscribe');
    });

    component.ngOnDestroy();

  });
});
