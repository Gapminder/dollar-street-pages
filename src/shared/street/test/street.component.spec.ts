import { Observable } from 'rxjs/Observable';
import { async, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { BrowserDetectionService, LanguageService, MathService, UrlChangeService, UtilsService } from '../../../common';
import {
  BrowserDetectionServiceMock,
  LanguageServiceMock,
  UrlChangeServiceMock,
  UtilsServiceMock
} from '../../../test/';
import { StreetComponent } from '../street.component';
import { StreetDrawService } from '../street.service';

describe('StreetComponent', () => {
  let languageService: LanguageServiceMock;

  let fixture: ComponentFixture<StreetComponent>;
  let component: StreetComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StoreModule.forRoot({})
      ],
      declarations: [StreetComponent],
      providers: [
        MathService,
        StreetDrawService,
        {provide: UrlChangeService, useClass: UrlChangeServiceMock},
        {provide: BrowserDetectionService, useClass: BrowserDetectionServiceMock},
        {provide: LanguageService, useClass: LanguageServiceMock},
        {provide: UtilsService, useClass: UtilsServiceMock}
      ]
    });

    fixture = TestBed.createComponent(StreetComponent);
    const testBed = getTestBed();
    component = fixture.componentInstance;

    languageService = testBed.get(LanguageService);
  }));

  it('ngAfterViewInit()', () => {
    spyOn(languageService, 'getTranslation').and.returnValue(Observable.of({POOREST: 'About', RICHEST: 'World'}));

    component.ngAfterViewInit();

    expect(component.getTranslationSubscribe).toBeDefined();
    expect(component.streetSettingsStateSubscription).toBeDefined();
    expect(component.appStateSubscription).toBeDefined();
    expect(component.streetFilterSubscribe).toBeDefined();
    expect(component.resize).toBeDefined();

    spyOn(component.getTranslationSubscribe, 'unsubscribe');
    spyOn(component.streetSettingsStateSubscription, 'unsubscribe');
    spyOn(component.appStateSubscription, 'unsubscribe');
    spyOn(component.streetFilterSubscribe, 'unsubscribe');
    spyOn(component.resize, 'unsubscribe');

    component.ngOnDestroy();

    expect(component.getTranslationSubscribe.unsubscribe).toHaveBeenCalled();
    expect(component.streetSettingsStateSubscription.unsubscribe).toHaveBeenCalled();
    expect(component.appStateSubscription.unsubscribe).toHaveBeenCalled();
    expect(component.streetFilterSubscribe.unsubscribe).toHaveBeenCalled();
    expect(component.resize.unsubscribe).toHaveBeenCalled();
  });
});
