import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { Angulartics2GoogleTagManager, Angulartics2Module } from 'angulartics2';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { MathService } from '../../common';
import { PhotographersComponent } from '../photographers.component';
import { PhotographersService } from '../photographers.service';
import { PhotographersFilterPipe } from '../photographers-filter.pipe';

import { CommonServicesTestingModule } from '../../test/commonServicesTesting.module';
import { TranslateTestingModule } from '../../test/translateTesting.module';

describe('Component: PhotographersComponent', () => {
  let component: PhotographersComponent;
  let fixture: ComponentFixture<PhotographersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        CommonServicesTestingModule,
        Angulartics2Module.forRoot([Angulartics2GoogleTagManager]),
        TranslateTestingModule
      ],
      declarations: [
        PhotographersComponent,
        PhotographersFilterPipe
      ],
      providers: [
        MathService,
        {provide: PhotographersService, useClass: PhotographersServiceMock}
      ]
    });

    fixture = TestBed.createComponent(PhotographersComponent);
    component = fixture.componentInstance;
  });

  it('define subscriptions on ngAfterViewInit()', () => {
    component.ngAfterViewInit();

    expect(component.keyUpSubscribe).toBeDefined();
    expect(component.getTranslationSubscribe).toBeDefined();
    expect(component.photographersServiceSubscribe).toBeDefined();
  });

  it('unsubscribe on destroy', () => {
    component.ngAfterViewInit();

    spyOn(component.keyUpSubscribe, 'unsubscribe');
    spyOn(component.getTranslationSubscribe, 'unsubscribe');
    spyOn(component.photographersServiceSubscribe, 'unsubscribe');

    component.ngOnDestroy();

    expect(component.keyUpSubscribe.unsubscribe).toHaveBeenCalled();
    expect(component.getTranslationSubscribe.unsubscribe).toHaveBeenCalled();
    expect(component.photographersServiceSubscribe.unsubscribe).toHaveBeenCalled();
  });
});

class PhotographersServiceMock {
  getPhotographers() {
    return Observable.of({
      data: {
        countryList: [],
        photographersList: []
      }
    });
  }
}
