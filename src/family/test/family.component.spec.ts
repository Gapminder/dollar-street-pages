import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { Angulartics2Module } from 'angulartics2';

import { FamilyModule } from '../family.module';
import { MathService, StreetSettingsEffects } from '../../common';
import { FamilyComponent } from '../family.component';

import { BlankComponent } from '../../test/';
import { CommonServicesTestingModule } from '../../test/commonServicesTesting.module';
import { TranslateTestingModule } from '../../test/translateTesting.module';
import { FamilyService } from '../family.service';
import { LocalStorageService } from '../../common/local-storage/local-storage.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// TODO needs fix
xdescribe('FamilyComponent', () => {
  let fixture: ComponentFixture<FamilyComponent>;
  let component: FamilyComponent;

  class MockFamilyService {
    public getThing(): Observable<any> {
      let response: any = {
        success: true,
        data: {
          _id: '546ccf730f7ddf45c017962f',
          thingName: 'Family',
          plural: 'Familias',
          originPlural: 'Families',
          originThingName: 'Family'
        },
        error: undefined
      };

      return Observable.of(response);
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FamilyModule,
        RouterTestingModule.withRoutes([{
          path: 'matrix',
          component: BlankComponent
        }]),
        TranslateTestingModule,
        Angulartics2Module,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([StreetSettingsEffects]),
        CommonServicesTestingModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [BlankComponent],
      providers: [
        LocalStorageService,
        MathService,
        {provide: FamilyService, useClass: MockFamilyService}
      ]
    });

    fixture = TestBed.createComponent(FamilyComponent);
    component = fixture.componentInstance;

    component.urlParams = {
      thing: '',
      countries: '',
      regions: '',
      zoom: 0,
      row: 0,
      lang: '',
      lowIncome: 26,
      highIncome: 15000
    };
  });


  it('ngOnInit() ngOnDestroy()', () => {
    component.ngOnInit();

    expect(component.theWorldTranslate).toEqual('translated');

    spyOn(component.queryParamsSubscribe, 'unsubscribe');
    spyOn(component.familyServiceSetThingSubscribe, 'unsubscribe');
    spyOn(component.getTranslationSubscribe, 'unsubscribe');

    component.ngOnDestroy();

    expect(component.queryParamsSubscribe.unsubscribe).toHaveBeenCalled();
    expect(component.familyServiceSetThingSubscribe.unsubscribe).toHaveBeenCalled();
    expect(component.getTranslationSubscribe.unsubscribe).toHaveBeenCalled();
  });
});
