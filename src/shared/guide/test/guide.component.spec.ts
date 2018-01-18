import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from 'ng2-translate';
import { Store, StoreModule } from '@ngrx/store';
import { LanguageService, LocalStorageService } from '../../../common';
import { LanguageServiceMock } from '../../../test/';
import { SocialShareButtonsComponent } from '../../social-share-buttons/social-share-buttons.component';
import { GuideComponent } from '../guide.component';
import { GuideService } from '../guide.service';
import { BubbleComponent } from '../bubble/bubble.component';
import { Observable } from 'rxjs/Observable';

describe('GuideComponent', () => {
  let fixture: ComponentFixture<GuideComponent>;
  let component: GuideComponent;

  class StoreMock {
    select() {
      return Observable.of({
        quickGuide: false
      });
    }

    dispatch() {
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule,
        StoreModule.forRoot({})
      ],
      declarations: [
        GuideComponent,
        BubbleComponent,
        SocialShareButtonsComponent
      ],
      providers: [
        { provide: GuideService, useClass: GuideServiceMock },
        LocalStorageService,
        { provide: LanguageService, useClass: LanguageServiceMock },
        { provide: Store, useClass: StoreMock }
      ]
    });

    fixture = TestBed.createComponent(GuideComponent);
    component = fixture.componentInstance;
  }));

  it('ngOnInit(), ngOnDestroy()', () => {
    component.ngOnInit();

    expect(component.guideServiceSubscribe).toBeDefined();
    expect(component.localStorageServiceSubscription).toBeDefined();

    spyOn(component.guideServiceSubscribe, 'unsubscribe');
    spyOn(component.localStorageServiceSubscription, 'unsubscribe');

    component.ngOnDestroy();

    expect(component.guideServiceSubscribe.unsubscribe).toHaveBeenCalled();
    expect(component.localStorageServiceSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('openQuickTour()', () => {
    component.ngOnInit();

    component.openQuickTour();

    expect(component.isShowGuide).toBeFalsy();
    expect(component.isShowBubble).toBeTruthy();
  });

  it('closeQuickGuide()', () => {
    component.ngOnInit();

    component.closeQuickGuide();

    component.isShowBubble = false;
    component.isShowGuide = false;
  });
});

class GuideServiceMock {
  getGuide(): Observable<any> {

    return Observable.of({ err: null, data: [{ name: 'welcomeHeader', description: 'string' }] });
  }
}
