import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component }    from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateLoader } from 'ng2-translate';
import { Angulartics2Module, Angulartics2 } from "angulartics2";

import {
    MathService,
    BrowserDetectionService,
    LanguageService,
    Angulartics2GoogleAnalytics,
    UtilsService,
    StreetSettingsService,
    StreetSettingsEffects,
} from '../../../common';
import { TranslateMeComponent } from "../../../shared/translate-me/translate-me.component";
import { RegionMapComponent } from "../../../shared/region-map/region-map.component";
import { FamilyHeaderComponent } from '../family-header.component';
import { FamilyHeaderService } from '../family-header.service';
import { IncomeCalcService } from '../../../common/income-calc/income-calc.service';

import {
  LanguageServiceMock,
  StreetSettingsServiceMock,
  AngularticsMock,
  AppTestModule,
  BlankComponent,
  BrowserDetectionServiceMock,
  UtilsServiceMock
} from '../../../test/';

class CustomLoader implements TranslateLoader {
  public getTranslation(lang: string): Observable<any> {
    return Observable.of({KEY: 'value'});
  }
}

describe('FamilyHeaderComponent', () => {
    let fixture: ComponentFixture<FamilyHeaderComponent>;
    let component: FamilyHeaderComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AppTestModule,
                Angulartics2Module,
                StoreModule.forRoot({}),
                EffectsModule.forRoot([StreetSettingsEffects]),
                RouterTestingModule.withRoutes([{path: '', component: BlankComponent}]),
                TranslateModule.forRoot({
                    provide: TranslateLoader,
                    useClass: CustomLoader
                })
            ],
            declarations: [
                FamilyHeaderComponent,
                TranslateMeComponent,
                RegionMapComponent
            ],
            providers: [
                MathService,
                FamilyHeaderService,
                { provide: BrowserDetectionService, useClass: BrowserDetectionServiceMock },
                { provide: UtilsService, useClass: UtilsServiceMock },
                { provide: StreetSettingsService, useClass: StreetSettingsServiceMock },
                { provide: LanguageService, useClass: LanguageServiceMock },
                { provide: Angulartics2GoogleAnalytics, useClass: AngularticsMock },
                { provide: Angulartics2, useClass: AngularticsMock },
                { provide: IncomeCalcService, useValue: {} }
            ]
        });

        fixture = TestBed.createComponent(FamilyHeaderComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('ngOnInit() ngOnDestroy()', () => {
        expect(component.getTranslationSubscribe).toBeDefined();
        expect(component.familyHeaderServiceSubscribe).toBeDefined();

        spyOn(component.getTranslationSubscribe, 'unsubscribe');
        spyOn(component.familyHeaderServiceSubscribe, 'unsubscribe');

        component.ngOnDestroy();

        expect(component.getTranslationSubscribe.unsubscribe).toHaveBeenCalled();
        expect(component.familyHeaderServiceSubscribe.unsubscribe).toHaveBeenCalled();
    });

    it('truncCountryName()', () => {
        const mockCountryName: any = {
            alias: 'United States'
        };

        component.truncCountryName(mockCountryName);

        expect(component.countryName).toEqual('USA');

        component.ngOnDestroy();
    });
});
