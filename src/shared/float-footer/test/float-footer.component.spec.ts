import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SocialShareService } from '../../../common';
import { FloatFooterComponent } from '../float-footer.component';
import { SocialShareButtonsComponent } from '../../social-share-buttons/social-share-buttons.component';
import { SocialShareButtonsService } from '../../social-share-buttons/social-share-buttons.service';
import { Store, StoreModule } from '@ngrx/store';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateTestingModule } from '../../../test/translateTesting.module';
import { CommonServicesTestingModule } from '../../../test/commonServicesTesting.module';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';

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

    expect(component.isDesktop).toBeTruthy();
    expect(component.scrollSubscribe).toBeDefined();

    spyOn(component.scrollSubscribe, 'unsubscribe');

    component.ngOnDestroy();

    expect(component.scrollSubscribe.unsubscribe).toHaveBeenCalled();
  });
});
