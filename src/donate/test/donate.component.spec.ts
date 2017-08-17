import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { TranslateModule, TranslateService, TranslateLoader, TranslateParser } from "ng2-translate";
import {
    LoaderService,
    TitleHeaderService,
    LanguageService,
    UtilsService,
    BrowserDetectionService
} from '../../common';
import {
    LoaderServiceMock,
    TitleHeaderServiceMock,
    LanguageServiceMock,
    UtilsServiceMock,
    BrowserDetectionServiceMock
}from '../../test/';
import { DonateComponent } from '../donate.component';
import { DonateService } from '../donate.service';

describe('DonateComponent', () => {
    let fixture: ComponentFixture<DonateComponent>;
    let component: DonateComponent;

    class DonateServiceMock {
        public makeDonate(): Observable<any> {
            return Observable.of({"success": true, "error": null});
        }
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule
            ],
            declarations: [DonateComponent],
            providers: [
                TranslateService,
                TranslateLoader,
                TranslateParser,
                { provide: BrowserDetectionService, useClass: BrowserDetectionServiceMock },
                { provide: DonateService, useClass: DonateServiceMock },
                { provide: LoaderService, useClass: LoaderServiceMock },
                { provide: TitleHeaderService, useClass: TitleHeaderServiceMock },
                { provide: LanguageService, useClass: LanguageServiceMock },
                { provide: UtilsService, useClass: UtilsServiceMock }
            ]
        });

        fixture = TestBed.createComponent(DonateComponent);
        component = fixture.componentInstance;
    }));

    it('ngOnInit(), ngOnDestroy()', () => {
        component.ngOnInit();

        expect(component.getTranslationSubscribe).toBeDefined();

        spyOn(component.getTranslationSubscribe, 'unsubscribe');

        component.ngOnDestroy();

        expect(component.getTranslationSubscribe.unsubscribe).toHaveBeenCalled();
    });
});