import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import {
    BrowserDetectionService,
    LanguageService,
    UtilsService
} from '../../../common';
import {
    LanguageServiceMock,
    AngularticsMock
} from '../../../test/';
import { StoreModule } from '@ngrx/store';
import { Angulartics2GoogleAnalytics } from 'angulartics2';
import { FooterComponent } from '../footer.component';
import { FooterService } from '../footer.service';

describe('FooterComponent', () => {
    let componentInstance: FooterComponent;
    let componentFixture: ComponentFixture<FooterComponent>;

    const footer = {"success":true,
                    "msg":[],
                    "data":{"text":"<p>Dollar Street is a Gapminder project - free for anyone to use.</p>\n<p>Today we feature more than 264 homes in 50 countries.</p>\n<p>In total we have more than 30 000 photos, and counting!</p>"},
                    "error":null};

    class FooterServiceMock {
        getFooter(): Observable<any> {
            return Observable.of(footer);
        }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                StoreModule.provideStore({})
            ],
            declarations: [ FooterComponent ],
            providers: [
                BrowserDetectionService,
                UtilsService,
                { provide: Angulartics2GoogleAnalytics, useClass: AngularticsMock },
                { provide: FooterService, useClass: FooterServiceMock },
                { provide: LanguageService, useClass: LanguageServiceMock }
            ]
        });

        componentFixture = TestBed.overrideComponent(FooterComponent, {
            set: {
                template: ''
            }
        }).createComponent(FooterComponent);

        componentInstance = componentFixture.componentInstance;

        componentFixture.detectChanges();
    }));

    it('ngOnInit()', () => {
        componentInstance.ngOnInit();

        expect(componentInstance.streetSettingsStateSubscription).toBeDefined();
        expect(componentInstance.routerEventsSubscribe).toBeDefined();
        expect(componentInstance.footerServiceSubscribe).toBeDefined();

        spyOn(componentInstance.streetSettingsStateSubscription, 'unsubscribe');
        spyOn(componentInstance.routerEventsSubscribe, 'unsubscribe');
        spyOn(componentInstance.footerServiceSubscribe, 'unsubscribe');

        componentInstance.ngOnDestroy();

        expect(componentInstance.streetSettingsStateSubscription.unsubscribe).toHaveBeenCalled();
        expect(componentInstance.routerEventsSubscribe.unsubscribe).toHaveBeenCalled();
        expect(componentInstance.footerServiceSubscribe.unsubscribe).toHaveBeenCalled();
    });
});
