import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PhotographerComponent } from '../photographer.component';
import { TranslateModule } from 'ng2-translate';
import { Angulartics2, Angulartics2GoogleTagManager, Angulartics2Module } from 'angulartics2';
import { LanguageService, LoaderService, MathService, TitleHeaderService } from '../../common';
import {
  Angulartics2GoogleAnalyticsMock,
  AngularticsMock,
  LanguageServiceMock,
  LoaderServiceMock,
  TitleHeaderServiceMock
} from '../../test/';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PhotographerComponent', () => {
  let fixture: ComponentFixture<PhotographerComponent>;
  let component: PhotographerComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule,
        Angulartics2Module
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        PhotographerComponent
      ],
      providers: [
        MathService,
        { provide: TitleHeaderService, useValue: TitleHeaderServiceMock },
        { provide: Angulartics2, useClass: AngularticsMock },
        { provide: Angulartics2GoogleTagManager, useClass: Angulartics2GoogleAnalyticsMock },
        { provide: LanguageService, useClass: LanguageServiceMock },
        { provide: LoaderService, useClass: LoaderServiceMock }
      ]
    });

    fixture = TestBed.createComponent(PhotographerComponent);
    component = fixture.componentInstance;
  });

  it('ngOnCreate() ngOnDestroy()', () => {
    component.ngOnInit();

    expect(component.titleHeaderService).toBeDefined();

    spyOn(component.queryParamsSubscribe, 'unsubscribe');

    component.ngOnDestroy();

    expect(component.queryParamsSubscribe.unsubscribe).toHaveBeenCalled();
  });
});
