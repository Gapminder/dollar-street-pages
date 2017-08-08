import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component }    from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateLoader } from 'ng2-translate';
import { FamilyHeaderComponent } from '../family-header.component';
import { FamilyHeaderService } from '../family-header.service';
import {
    MathService,
    BrowserDetectionService,
    LanguageService,
    Angulartics2GoogleAnalytics,
    UtilsService,
    StreetSettingsService,
    StreetSettingsEffects,
    StreetSettingsActions
} from '../../../common';
import {
    LanguageServiceMock,
    StreetSettingsServiceMock,
    AngularticsMock,
    BlankComponent,
    BrowserDetectionServiceMock,
    UtilsServiceMock
} from '../../../test/';

/* tslint:disable */
class CustomLoader implements TranslateLoader {
  public getTranslation(lang: string): Observable<any> {
    return Observable.of({KEY: 'value'});
  }
}
/* tslint:enable */

describe('FamilyHeaderComponent', () => {
    let componentInstance: FamilyHeaderComponent;
    let componentFixture: ComponentFixture<FamilyHeaderComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [],
            imports: [
                StoreModule.provideStore({}),
                EffectsModule.run(StreetSettingsEffects),
                RouterTestingModule.withRoutes([{path: '', component: BlankComponent}]),
                TranslateModule.forRoot({
                    provide: TranslateLoader,
                    useClass: CustomLoader
                })
            ],
            declarations: [BlankComponent, FamilyHeaderComponent],
            providers: [
                MathService,
                FamilyHeaderService,
                StreetSettingsActions,
                { provide: BrowserDetectionService, useClass: BrowserDetectionServiceMock },
                { provide: UtilsService, useClass: UtilsServiceMock },
                { provide: StreetSettingsService, useClass: StreetSettingsServiceMock },
                { provide: LanguageService, useClass: LanguageServiceMock },
                { provide: Angulartics2GoogleAnalytics, useClass: AngularticsMock }
            ]
        });

        componentFixture = TestBed.overrideComponent(FamilyHeaderComponent, {
            set: {
                template: '<div></div>'
            }
        }).createComponent(FamilyHeaderComponent);

        componentInstance = componentFixture.componentInstance;

        componentFixture.detectChanges();
    });

    it('ngOnInit() ngOnDestroy()', () => {
        componentInstance.ngOnInit();

        expect(componentInstance.getTranslationSubscribe).toBeDefined();
        expect(componentInstance.familyHeaderServiceSubscribe).toBeDefined();

        spyOn(componentInstance.getTranslationSubscribe, 'unsubscribe');
        spyOn(componentInstance.familyHeaderServiceSubscribe, 'unsubscribe');

        componentInstance.ngOnDestroy();

        expect(componentInstance.getTranslationSubscribe.unsubscribe).toHaveBeenCalled();
        expect(componentInstance.familyHeaderServiceSubscribe.unsubscribe).toHaveBeenCalled();
    });

    it('truncCountryName()', () => {
        componentInstance.ngOnInit();

        const mockCountryName: any = {
            alias: 'United States'
        };

        componentInstance.truncCountryName(mockCountryName);

        expect(componentInstance.countryName).toEqual('USA');

        componentInstance.ngOnDestroy();
    });
});
