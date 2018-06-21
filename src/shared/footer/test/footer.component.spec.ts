import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { TranslateModule, TranslateService, TranslateLoader, TranslateParser } from 'ng2-translate';
import {
    BrowserDetectionService,
    LanguageService,
    UtilsService
} from '../../../common';
import {
    LanguageServiceMock,
    AngularticsMock,
    BrowserDetectionServiceMock,
    UtilsServiceMock,
    TranslateLoaderMock,
    TranslateParserMock,
    TranslateServiceMock
} from '../../../test/';
import { StoreModule } from '@ngrx/store';
import { Angulartics2GoogleTagManager } from 'angulartics2';
import { FooterComponent } from '../footer.component';
import { FooterService } from '../footer.service';
import { SocialFollowButtonsComponent } from '../../social-follow-buttons/social-follow-buttons.component';
import { forEach } from 'lodash';

describe('FooterComponent', () => {
    let fixture: ComponentFixture<FooterComponent>;
    let component: FooterComponent;

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
                StoreModule.forRoot({}),
                TranslateModule
            ],
            declarations: [
              FooterComponent,
              SocialFollowButtonsComponent
            ],
            providers: [
                { provide: TranslateService, useClass: TranslateServiceMock },
                { provide: TranslateLoader, useClass: TranslateLoaderMock },
                { provide: TranslateParser, useClass: TranslateParserMock },
                { provide: BrowserDetectionService, useClass: BrowserDetectionServiceMock },
                { provide: UtilsService, useClass: UtilsServiceMock },
                { provide: Angulartics2GoogleTagManager, useClass: AngularticsMock },
                { provide: FooterService, useClass: FooterServiceMock },
                { provide: LanguageService, useClass: LanguageServiceMock }
            ]
        });

        fixture = TestBed.createComponent(FooterComponent);
        component = fixture.componentInstance;
    }));

    it('ngOnInit()', () => {
        component.ngOnInit();

        forEach(component.ngSubscriptions, (value, key) => {
          spyOn(value, 'unsubscribe');
        });

        component.ngOnDestroy();

        forEach(component.ngSubscriptions, (value, key) => {
          expect(value.unsubscribe).toHaveBeenCalled();
        });
    });
});
