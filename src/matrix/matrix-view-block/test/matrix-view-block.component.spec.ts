import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Angulartics2GoogleAnalytics, Angulartics2Module } from 'angulartics2';
import { TranslateModule, TranslateService } from 'ng2-translate';
import { StoreModule } from '@ngrx/store';
import {
    MathService,
    BrowserDetectionService,
    LanguageService,
    UtilsService
} from '../../../common';
import {
    TranslateServiceMock,
    AngularticsMock,
    BrowserDetectionServiceMock,
    LanguageServiceMock,
    UtilsServiceMock
} from '../../../test/';
import {
    SharedModule
} from '../../../shared';
import { MatrixViewBlockComponent } from '../matrix-view-block.component';
import { MatrixViewBlockService } from '../matrix-view-block.service';

describe('MatrixViewBlockComponent', () => {
    let component: MatrixViewBlockComponent;
    let fixture: ComponentFixture<MatrixViewBlockComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule,
                RouterTestingModule,
                Angulartics2Module,
                SharedModule,
                StoreModule.provideStore({})
            ],
            declarations: [MatrixViewBlockComponent],
            providers: [
                MathService,
                MatrixViewBlockService,
                { provide: TranslateService, useClass: TranslateServiceMock },
                { provide: Angulartics2GoogleAnalytics, useClass: AngularticsMock },
                { provide: TranslateService, useClass: TranslateServiceMock },
                { provide: BrowserDetectionService, useClass: BrowserDetectionServiceMock },
                { provide: LanguageService, useClass: LanguageServiceMock },
                { provide: UtilsService, useClass: UtilsServiceMock }
            ]
        });

        fixture = TestBed.createComponent(MatrixViewBlockComponent);
        component = fixture.componentInstance;

        component.query = '?thing=Families&countries=World&region=World';
        component.streetData = {
            showDividers: true,
            low: 27,
            medium: 140,
            high: 500,
            poor: 30,
            rich: 60,
            lowDividerCoord: 0,
            mediumDividerCoord: 100,
            highDividerCoord: 200
        };
    }));

    it('ngOnInit()', () => {
        component.ngOnInit();

        expect(component.streetSettingsStateSubscription).toBeDefined();
        expect(component.resizeSubscribe).toBeDefined();

        spyOn(component.streetSettingsStateSubscription, 'unsubscribe');
        spyOn(component.resizeSubscribe, 'unsubscribe');

        component.ngOnDestroy();

        expect(component.streetSettingsStateSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.resizeSubscribe.unsubscribe).toHaveBeenCalled();
    });

    it('fancyBoxClose()', () => {
        component.fancyBoxClose();

        expect(component.popIsOpen).toBeFalsy();
        expect(component.fancyBoxImage).toBeFalsy();
    });

    it('goToMatrixByCountry()', () => {
        component.goToMatrixByCountry('Nigeria');
    });

    it('getDescription()', () => {
        const description = 'This is a long description';

        let resp = component.getDescription(description);

        expect(resp).toEqual(description);
    });

    it('truncCountryName()', () => {
        let resp = component.truncCountryName({alias: 'South Africa'});

        expect(resp).toEqual('SA');
    });
});