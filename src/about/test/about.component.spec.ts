import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { AboutComponent } from '../about.component';
import { AboutService } from '../about.service';
import { CommonServicesTestingModule } from '../../test/commonServicesTesting.module';
import { RouterTestingModule } from '@angular/router/testing';
import { LanguageServiceMock } from '../../test/mocks/language.service.mock';
import { LanguageService } from '../../common/language/language.service';
import { LoaderService } from '../../common/loader/loader.service';
import { LoaderServiceMock } from '../../test/mocks/loader.service.mock';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;
  let aboutService: AboutServiceMock;
  let languageService: LanguageServiceMock;
  let loaderService: LoaderServiceMock;
  let activatedRoute: ActivatedRouteMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonServicesTestingModule
      ],
      declarations: [AboutComponent],
      providers: [
        { provide: AboutService, useClass: AboutServiceMock },
        { provide: ActivatedRoute, useClass: ActivatedRouteMock }
      ]
    });

    fixture = TestBed.createComponent(AboutComponent);
    languageService = TestBed.get(LanguageService);
    aboutService = TestBed.get(AboutService);
    loaderService = TestBed.get(LoaderService);
    activatedRoute = TestBed.get(ActivatedRoute);

    component = fixture.componentInstance;
  });

  it('check subscriptions on init', () => {
    component.ngAfterViewInit();

    expect(component.getTranslationSubscription).toBeDefined();
    expect(component.aboutSubscription).toBeDefined();
    expect(component.queryParamsSubscription).toBeDefined();
  });

  it('unsubscribe on destroy', () => {
    component.ngAfterViewInit();

    spyOn(component.getTranslationSubscription, 'unsubscribe');
    spyOn(component.aboutSubscription, 'unsubscribe');
    spyOn(component.queryParamsSubscription, 'unsubscribe');

    component.ngOnDestroy();

    expect(component.getTranslationSubscription.unsubscribe).toHaveBeenCalledWith();
    expect(component.aboutSubscription.unsubscribe).toHaveBeenCalledWith();
    expect(component.queryParamsSubscription.unsubscribe).toHaveBeenCalledWith();
  });

  it('set content in div', () => {
    const expectedContent = 'About Dollar Street';

    spyOn(languageService, 'getSunitizedString').and.returnValue(expectedContent);

    const divWithAboutContent = fixture.debugElement.query(By.css('div')).nativeElement;

    fixture.detectChanges();
    expect(divWithAboutContent.getAttribute('id')).toEqual('info-context');
    expect(divWithAboutContent.innerText).toEqual(expectedContent);
  });

  it('set loader on init', () => {
    spyOn(loaderService, 'setLoader');
    component.ngAfterViewInit();

    expect(loaderService.setLoader).toHaveBeenCalledWith(false);
  });

  it('should scroll to element from queryParams', () => {
    const jumpToId = 'info-context';
    spyOn(activatedRoute, 'queryParams').and.returnValue(new BehaviorSubject({ jump: jumpToId }));
    spyOn(window, 'scrollTo');
    (window.scrollY as any) = 0;

    fixture.detectChanges();

    const jumpToElement = fixture.debugElement.query(By.css(`#${jumpToId}`)).nativeElement;
    spyOn(jumpToElement, 'scrollIntoView');
    
    component.ngAfterViewInit();

    expect(jumpToElement.scrollIntoView).toHaveBeenCalled();
    expect(window.scrollTo).toHaveBeenCalledWith(0, -80);
  });
});


class ActivatedRouteMock {
  queryParams = new BehaviorSubject({ jump: 'info-context' });
}

class AboutServiceMock {
  getInfo(query: any): Observable<any> {
    return Observable.of({ err: null, data: { context: null } });
  }
}