import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule, TranslateService } from 'ng2-translate';
import { RouterTestingModule } from '@angular/router/testing';
import { Angulartics2GoogleAnalytics, Angulartics2, Angulartics2Module } from 'angulartics2';
import {
    MathService,
    LoaderService,
    TitleHeaderService,
    BrowserDetectionService,
    LanguageService
} from '../../common';
import {
    TranslateServiceMock,
    Angulartics2GoogleAnalyticsMock,
    AngularticsMock,
    LoaderServiceMock,
    TitleHeaderServiceMock,
    BrowserDetectionServiceMock,
    LanguageServiceMock
} from '../../test/';
import { PhotographersComponent } from '../photographers.component';
import { PhotographersService } from '../photographers.service';
import { PhotographersFilterPipe } from '../photographers-filter.pipe';

describe('PhotographersComponent', () => {
    let component: PhotographersComponent;
    let fixture: ComponentFixture<PhotographersComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule,
                RouterTestingModule,
                Angulartics2Module
            ],
            declarations: [
                PhotographersComponent,
                PhotographersFilterPipe
            ],
            providers: [
                MathService,
                PhotographersService,
                { provide: TranslateService, useClass: TranslateServiceMock },
                { provide: Angulartics2GoogleAnalytics, useClass: Angulartics2GoogleAnalyticsMock },
                { provide: Angulartics2, useClass: AngularticsMock },
                { provide: LoaderService, useClass: LoaderServiceMock },
                { provide: TitleHeaderService, useClass: TitleHeaderServiceMock },
                { provide: BrowserDetectionService, useClass: BrowserDetectionServiceMock },
                { provide: LanguageService, useClass: LanguageServiceMock }
            ]
        });

        fixture = TestBed.createComponent(PhotographersComponent);
        component = fixture.componentInstance;
    }));

    it('ngAfterViewInit()', () => {
        component.ngAfterViewInit();

        expect(component.keyUpSubscribe).toBeDefined();
        expect(component.getTranslationSubscribe).toBeDefined();
        expect(component.photographersServiceSubscribe).toBeDefined();

        spyOn(component.keyUpSubscribe, 'unsubscribe');
        spyOn(component.getTranslationSubscribe, 'unsubscribe');
        spyOn(component.photographersServiceSubscribe, 'unsubscribe');

        component.ngOnDestroy();

        expect(component.keyUpSubscribe.unsubscribe).toHaveBeenCalled();
        expect(component.getTranslationSubscribe.unsubscribe).toHaveBeenCalled();
        expect(component.photographersServiceSubscribe.unsubscribe).toHaveBeenCalled();
    });
});