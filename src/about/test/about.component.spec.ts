import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpModule } from '@angular/http';

import {
LoaderService,
TitleHeaderService,
LanguageService
} from '../../common';
import {
LoaderServiceMock,
LanguageServiceMock,
TitleHeaderServiceMock
} from '../../test/';
import { AboutComponent } from '../about.component';
import { AboutService } from '../about.service';

describe('AboutComponent', () => {
  let componentInstance: AboutComponent;
  let componentFixture: ComponentFixture<AboutComponent>;
  let debugElement: DebugElement;
  let nativeElement: HTMLElement;

  class ActivatedRouteMock {
    params = new BehaviorSubject({jump: '123'});
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AboutComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {provide: AboutService, useValue: {}},
        {provide: LoaderService, useClass: LoaderServiceMock},
        {provide: TitleHeaderService, useClass: TitleHeaderServiceMock},
        {provide: LanguageService, useClass: LanguageServiceMock},
        {provide: ActivatedRoute, useClass: ActivatedRouteMock}
      ]
    });

    componentFixture = TestBed.createComponent(AboutComponent);

    componentInstance = componentFixture.componentInstance;
    debugElement = componentFixture.debugElement.query(By.css('div'));
    nativeElement = debugElement.nativeElement;
  }));

  it('Div with ID', () => {
    expect(nativeElement.getAttribute('id')).toEqual('info-context');
  });
});
