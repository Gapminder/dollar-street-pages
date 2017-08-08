import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { DonateComponent } from '../donate.component';
import { DonateService } from '../donate.service';
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
            imports: [],
            declarations: [DonateComponent],
            providers: [
                { provide: BrowserDetectionService, useClass: BrowserDetectionServiceMock },
                { provide: DonateService, useClass: DonateServiceMock },
                { provide: LoaderService, useClass: LoaderServiceMock },
                { provide: TitleHeaderService, useClass: TitleHeaderServiceMock },
                { provide: LanguageService, useClass: LanguageServiceMock },
                { provide: UtilsService, useClass: UtilsServiceMock }
            ]
        });

        fixture = TestBed.overrideComponent(DonateComponent, {
            set: {
                template: ''
            }
        }).createComponent(DonateComponent);

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