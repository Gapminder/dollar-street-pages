import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SocialShareService } from '../../../common';
import { FloatFooterComponent } from '../float-footer.component';
import { SocialShareButtonsService } from '../../social-share-buttons/social-share-buttons.service';
import { Store, StoreModule } from '@ngrx/store';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateTestingModule } from '../../../test/translateTesting.module';
import { CommonServicesTestingModule } from '../../../test/commonServicesTesting.module';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { forEach } from 'lodash';
import { Subscription } from 'rxjs/Subscription';

describe('Component: FloatFooterComponent', () => {
  let fixture: ComponentFixture<FloatFooterComponent>;
  let component: FloatFooterComponent;

  class SocialShareButtonsServiceMock {

  }

  class SocialShareServiceMock {

  }

  class StoreMock {
    select() {
      return Observable.of({
        pinMode: false
      });
    }

    dispatch() {
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateTestingModule,
        RouterTestingModule,
        CommonServicesTestingModule,
        StoreModule.forRoot({})
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        FloatFooterComponent
        // SocialShareButtonsComponent
      ],
      providers: [
        {provide: SocialShareButtonsService, useClass: SocialShareButtonsServiceMock},
        {provide: SocialShareService, useClass: SocialShareServiceMock},
        {provide: Store, useClass: StoreMock}
      ]
    });

    fixture = TestBed.createComponent(FloatFooterComponent);
    component = fixture.componentInstance;
  }));

  it('ngAfterViewInit()', () => {
    component.ngOnInit();
    component.ngAfterViewInit();

    forEach(component.ngSubscriptions, (subscription: Subscription) => {
      spyOn(subscription, 'unsubscribe');
    });
    component.ngOnDestroy();

    forEach(component.ngSubscriptions, (subscription: Subscription) => {
      expect(subscription.unsubscribe).toHaveBeenCalled();
    });
  });
});
