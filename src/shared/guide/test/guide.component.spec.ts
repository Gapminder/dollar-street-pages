import { Component, Input, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from 'ng2-translate';
import { Observable } from 'rxjs/Observable';

import { MockComponent } from 'ng2-mock-component';

import * as MatrixActions from '../../../matrix/ngrx/matrix.actions';
import * as fromRoot from '../../../app/ngrx/root.reducer';
import { LanguageService, LocalStorageService } from '../../../common';
import { LanguageServiceMock } from '../../../test/';
import { SocialShareButtonsComponent } from '../../social-share-buttons/social-share-buttons.component';
import { GuideComponent } from '../guide.component';
import { GuideService } from '../guide.service';
import { BubbleComponent } from '../bubble/bubble.component';
import { CommonServicesTestingModule } from '../../../test/commonServicesTesting.module';
import { LocalStorageServiceMock } from '../../../test/mocks/localStorage.service.mock';
import { AppStates } from '../../../interfaces';

describe('GuideComponent', () => {
  let fixture: ComponentFixture<GuideComponent>;
  let component: GuideComponent;
  let localStorageService: LocalStorageServiceMock;
  let store: Store<AppStates>;
  let guideService: GuideService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ ...fromRoot.reducers }),
        CommonServicesTestingModule
      ],
      declarations: [
        GuideComponent,
        MockComponent({ selector: 'bubble', inputs: ['bubbles'] })
      ],
      providers: [
        { provide: GuideService, useClass: GuideServiceMock }
      ]
    });

    localStorageService = TestBed.get(LocalStorageService);
    guideService = TestBed.get(GuideService);
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();

    fixture = TestBed.createComponent(GuideComponent);
    component = fixture.componentInstance;
  });

  it('dispath store with isShowGuide value on init', () => {
    const action = new MatrixActions.OpenQuickGuide(false);
    spyOn(localStorageService, 'getItem').and.returnValue('true');

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('openQuickTour by click', () => {
    fixture.detectChanges();

    let expectedEvent;
    component.startQuickGuide.subscribe(event => expectedEvent = event);

    const openGuideBtn = fixture.debugElement.queryAll(By.css('.button-container button'))[0];
    openGuideBtn.triggerEventHandler('click', null);

    fixture.detectChanges();

    const bubble = fixture.debugElement.query(By.css('bubble'));

    expect(component.isShowGuide).toBeFalsy();
    expect(component.isShowBubble).toBeTruthy();
    expect(expectedEvent).toEqual({});
    expect(bubble).toBeTruthy();
  });

  it('closeQuickGuide by click', () => {
    const action = new MatrixActions.OpenQuickGuide(false);

    fixture.detectChanges();

    const closeGuideBtn = fixture.debugElement.queryAll(By.css('.button-container button'))[1];
    closeGuideBtn.triggerEventHandler('click', null);

    fixture.detectChanges();

    const bubble = fixture.debugElement.query(By.css('bubble'));

    expect(store.dispatch).toHaveBeenCalledWith(action);
    expect(bubble).toBeFalsy();
  });

  it('closeQuickGuide by click on X icon', () => {
    const action = new MatrixActions.OpenQuickGuide(false);
    fixture.detectChanges();

    const closeGuideBtn = fixture.debugElement.queryAll(By.css('.button-container button'))[1];
    closeGuideBtn.triggerEventHandler('click', null);

    fixture.detectChanges();

    const bubble = fixture.debugElement.query(By.css('bubble'));

    expect(store.dispatch).toHaveBeenCalledWith(action);
    expect(bubble).toBeFalsy();
  });
});

class GuideServiceMock {
  getGuide(): Observable<any> {

    return Observable.of({ err: null, data: [{ name: 'welcomeHeader', description: 'string' }] });
  }
}
