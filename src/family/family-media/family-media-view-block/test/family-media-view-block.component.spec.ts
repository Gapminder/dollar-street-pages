import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component }    from '@angular/core';
import { FamilyMediaViewBlockComponent } from '../family-media-view-block.component';
import { FamilyMediaViewBlockService } from '../family-media-view-block.service';
import { Observable } from 'rxjs/Observable';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateLoader } from 'ng2-translate';
import {
    Angulartics2Module,
    Angulartics2GoogleAnalytics,
    Angulartics2
} from 'angulartics2';
import { SharedModule } from '../../../../shared';
import { mockFamilyMediaText } from './mock.data';
import {
    LanguageService,
    BrowserDetectionService,
    UtilsService,
    StreetSettingsService,
    StreetSettingsEffects,
} from '../../../../common';
import {
    LanguageServiceMock,
    StreetSettingsServiceMock,
    BlankComponent,
    BrowserDetectionServiceMock,
    UtilsServiceMock,
    AngularticsMock,
    Angulartics2GoogleAnalyticsMock
} from '../../../../test/';

/* tslint:disable */
class CustomLoader implements TranslateLoader {
  public getTranslation(lang: string): Observable<any> {
    return Observable.of({KEY: 'value'});
  }
}
/* tslint:enable */

describe('FamilyMediaViewBlockComponent', () => {
    let componentInstance: FamilyMediaViewBlockComponent;
    let componentFixture: ComponentFixture<FamilyMediaViewBlockComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule,
                Angulartics2Module,
                StoreModule.forRoot({}),
                EffectsModule.forRoot([StreetSettingsEffects]),
                RouterTestingModule.withRoutes([{path: '', component: BlankComponent}]),
                TranslateModule.forRoot({
                    provide: TranslateLoader,
                    useClass: CustomLoader
                })
            ],
            declarations: [ FamilyMediaViewBlockComponent, BlankComponent ],
            providers: [
                FamilyMediaViewBlockService,
                { provide: Angulartics2GoogleAnalytics, useClass: Angulartics2GoogleAnalyticsMock },
                { provide: BrowserDetectionService, useClass: BrowserDetectionServiceMock },
                { provide: Angulartics2, useClass: AngularticsMock },
                { provide: UtilsService, useClass: UtilsServiceMock },
                { provide: StreetSettingsService, useClass: StreetSettingsServiceMock },
                { provide: LanguageService, useClass: LanguageServiceMock }
            ]
        }).compileComponents();

        componentFixture = TestBed.createComponent(FamilyMediaViewBlockComponent);

        componentInstance = componentFixture.componentInstance;

        componentInstance.imageData = {
            photographer: 'mockPhotographer',
            image: 'http://dollar-street.org/images/imageId=1234567890'
        };

    });

    afterEach(() => {
        componentFixture.detectChanges();
    });

    it('ngOnInit() ngOnDestroy()', () => {
        componentInstance.ngOnInit();

        componentInstance.ngOnDestroy();
    });

    it('openPopUp()', () => {
        componentInstance.ngOnInit();

        componentInstance.openPopUp();

        expect(componentInstance.popIsOpen).toBeTruthy();
    });

    it('fancyBoxClose()', () => {
        componentInstance.ngOnInit();

        componentInstance.fancyBoxClose();

        expect(componentInstance.popIsOpen).toBeFalsy();
    });

    it('truncCountryName()', () => {
        const mockCountryData: any = {
            name: 'United States'
        };

        componentInstance.ngOnInit();

        componentInstance.truncCountryName(mockCountryData);

        expect(componentInstance.countryName).toEqual('USA');
    });

    it('getDescription()', () => {
        componentInstance.ngOnInit();

        let textLength: number = componentInstance.getDescription(mockFamilyMediaText).length;

        expect(textLength).toEqual(203);
    });
});
