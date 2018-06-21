import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { By } from '@angular/platform-browser';

import { LanguageService, SocialShareService } from '../../../common';
import { LanguageServiceMock } from '../../../test/';
import { SocialShareButtonsComponent } from '../social-share-buttons.component';
import { SocialShareButtonsService } from '../social-share-buttons.service';
import { CommonServicesTestingModule } from '../../../test/commonServicesTesting.module';
import { Angulartics2GoogleTagManager } from 'angulartics2';
import { Angulartics2GoogleAnalyticsMock } from '../../../test/mocks/angulartics2GoogleAnalytics.mock';

describe('SocialShareButtonsComponent', () => {
  let fixture: ComponentFixture<SocialShareButtonsComponent>;
  let component: SocialShareButtonsComponent;
  let socialShareButtonsService: SocialShareButtonsServiceMock;
  let languageService: LanguageServiceMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonServicesTestingModule
      ],
      declarations: [SocialShareButtonsComponent],
      providers: [
        { provide: SocialShareService, useValue: {} },
        { provide: SocialShareButtonsService, useClass: SocialShareButtonsServiceMock },
        { provide: Angulartics2GoogleTagManager, useClass: Angulartics2GoogleAnalyticsMock },
      ]
    });

    fixture = TestBed.createComponent(SocialShareButtonsComponent);
    component = fixture.componentInstance;
    socialShareButtonsService = TestBed.get(SocialShareButtonsService);
    languageService = TestBed.get(LanguageService);

    spyOn(component.window, 'open').and.returnValue(new windowMock());
    (component.window.innerWidth as any) = 1000;
  });

  it('check subscriptions on init', () => {
    fixture.detectChanges();

    expect(component.getTranslationSubscribe).toBeDefined();
  });

  it('unsubscribe on destroy', () => {
    fixture.detectChanges();
    spyOn(component.getTranslationSubscribe, 'unsubscribe');

    component.ngOnDestroy();

    expect(component.getTranslationSubscribe.unsubscribe).toHaveBeenCalled();
  });

  it('open twitter popup', () => {
    spyOn(languageService, 'getTranslation').and.returnValue(Observable.of({SEE_HOW_PEOPLE: 'see', REALLY: 'really', LIVE:'live'}));
    spyOn(socialShareButtonsService, 'getUrl').and.returnValue(Observable.of({ err: null, url: '/expected/url' }));

    fixture.detectChanges();

    const twitterBtn = fixture.debugElement.query(By.css('.share-button.twitter a'));
    twitterBtn.triggerEventHandler('click', null);

    fixture.detectChanges();

    expect(component.socialShareButtonsServiceSubscribe).toBeDefined();
    expect(component.newWindow.location.href).toEqual('https://twitter.com/intent/tweet?url=/expected/url&text=see%20really%20live-%20Dollar%20Street');
  });

  it('open facebook popup', () => {
    spyOn(languageService, 'getTranslation').and.returnValue(Observable.of({SEE_HOW_PEOPLE: 'see', REALLY: 'really', LIVE:'live'}));
    spyOn(socialShareButtonsService, 'getUrl').and.returnValue(Observable.of({ err: null, url: '/expected/url' }));

    fixture.detectChanges();

    const facebookBtn = fixture.debugElement.query(By.css('.share-button.facebook a'));
    facebookBtn.triggerEventHandler('click', null);

    fixture.detectChanges();

    expect(component.socialShareButtonsServiceSubscribe).toBeDefined();
    expect(component.newWindow.location.href).toEqual('http://www.facebook.com/sharer.php?u=/expected/url&description=see%20really%20live');
  });

  it('open linkedin popup', () => {
    spyOn(languageService, 'getTranslation').and.returnValue(Observable.of({SEE_HOW_PEOPLE: 'see', REALLY: 'really', LIVE:'live'}));
    spyOn(socialShareButtonsService, 'getUrl').and.returnValue(Observable.of({ err: null, url: '/expected/url' }));

    fixture.detectChanges();

    const linkedinBtn = fixture.debugElement.query(By.css('.share-button.linkedin a'));
    linkedinBtn.triggerEventHandler('click', null);

    fixture.detectChanges();

    expect(component.socialShareButtonsServiceSubscribe).toBeDefined();
    expect(component.newWindow.location.href).toEqual('http://www.linkedin.com/shareArticle?mini=true&url=/expected/url&summary=see%20really%20live');
  });

  it('open googlePlus popup', () => {
    spyOn(languageService, 'getTranslation').and.returnValue(Observable.of({SEE_HOW_PEOPLE: 'see', REALLY: 'really', LIVE:'live'}));
    spyOn(socialShareButtonsService, 'getUrl').and.returnValue(Observable.of({ err: null, url: '/expected/url' }));

    fixture.detectChanges();

    const googlePlusBtn = fixture.debugElement.query(By.css('.share-button.google a'));
    googlePlusBtn.triggerEventHandler('click', null);

    fixture.detectChanges();

    expect(component.socialShareButtonsServiceSubscribe).toBeDefined();
    expect(component.newWindow.location.href).toEqual('https://plus.google.com/share?url=/expected/url&text=see%20really%20live');
  });
});

class SocialShareButtonsServiceMock {
  getUrl(query: any): Observable<any> {
    return Observable.of({ err: null, url: null });
  }
}

class windowMock {
  location = {
    href: '//fake/href'
  }

  focus() { };
}
