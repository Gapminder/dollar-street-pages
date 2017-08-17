import { Observable } from "rxjs/Observable";
import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { StoreModule } from "@ngrx/store";
import {
    MathService,
    BrowserDetectionService,
    LanguageService,
    UtilsService,
    ActiveThingService
} from "../../../common";
import {
    BrowserDetectionServiceMock,
    LanguageServiceMock,
    UtilsServiceMock
} from '../../../test/';
import { StreetComponent } from "../street.component";
import { StreetDrawService } from "../street.service";

describe('StreetComponent', () => {
    let fixture: ComponentFixture<StreetComponent>;
    let component: StreetComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                StoreModule.forRoot({})
            ],
            declarations: [StreetComponent],
            providers: [
                MathService,
                StreetDrawService,
                ActiveThingService,
                { provide: BrowserDetectionService, useClass: BrowserDetectionServiceMock },
                { provide: LanguageService, useClass: LanguageServiceMock },
                { provide: UtilsService, useClass: UtilsServiceMock }
            ]
        });

        fixture = TestBed.createComponent(StreetComponent);
        component = fixture.componentInstance;

        spyOn(component.languageService, 'getTranslation').and.returnValue(Observable.of({'POOREST': 'Poorest', 'RICHEST': 'Richest'}));
    }));

    it('ngAfterViewInit()', () => {
        component.ngAfterViewInit();

        expect(component.getTranslationSubscribe).toBeDefined();
        expect(component.activeThingServiceSubscription).toBeDefined();
        expect(component.streetSettingsStateSubscription).toBeDefined();
        expect(component.appStateSubscription).toBeDefined();
        expect(component.streetFilterSubscribe).toBeDefined();
        expect(component.resize).toBeDefined();

        spyOn(component.getTranslationSubscribe, 'unsubscribe');
        spyOn(component.activeThingServiceSubscription, 'unsubscribe');
        spyOn(component.streetSettingsStateSubscription, 'unsubscribe');
        spyOn(component.appStateSubscription, 'unsubscribe');
        spyOn(component.streetFilterSubscribe, 'unsubscribe');
        spyOn(component.resize, 'unsubscribe');

        component.ngOnDestroy();

        expect(component.getTranslationSubscribe.unsubscribe).toHaveBeenCalled();
        expect(component.activeThingServiceSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.streetSettingsStateSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.appStateSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.streetFilterSubscribe.unsubscribe).toHaveBeenCalled();
        expect(component.resize.unsubscribe).toHaveBeenCalled();
    });
});