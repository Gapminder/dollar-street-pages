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
import { forEach } from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { MatrixService } from '../../../matrix/matrix.service';
import { MatrixServiceMock } from '../../../test/mocks/matrixService.service.mock';

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
        {provide: UtilsService, useClass: UtilsServiceMock},
        {provide: MatrixService, useClass: MatrixServiceMock}
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

    forEach(component.ngSubscriptions, (subscription: Subscription) => {
      spyOn(subscription, 'unsubscribe');
    });

    component.ngOnDestroy();

    forEach(component.ngSubscriptions, (subscription: Subscription) => {
      expect(subscription.unsubscribe).toHaveBeenCalled();
    })
  });
});
