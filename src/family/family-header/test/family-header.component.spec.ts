import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component }    from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { RouterTestingModule } from '@angular/router/testing';

import { TranslateModule, TranslateLoader } from 'ng2-translate';

import { FamilyHeaderComponent } from '../family-header.component';
import { FamilyHeaderService } from '../family-header.service';

import {
         MathService,
         StreetSettingsService,
         BrowserDetectionService,
         LanguageService,
         Angulartics2GoogleAnalytics
} from '../../../common';

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

    @Component({
        template: ''
    })
    class BlankComponent { }

    class MockStreetSettingsService {
        public getStreetSettings(): Observable<any> {
            let context: any = {_id:'57963211cc4aaed63a02504c',showDividers:false,low:30,medium:300,high:3000,poor:26,rich:15000,lowDividerCoord:78,mediumDividerCoord:490,highDividerCoord:920,__v:0};
            let response: any = {success:true,error:false,msg:[],data:context};

            return Observable.of(response);
        }
    }

    class MockLanguageService {
        public getTranslation(): Observable<any> {
            return Observable.of('the world');
        }

        public getLanguageParam(): string {
            return '&lang=en';
        }
    }

    class MockAngulartics {
        // tslint:disable-next-line
        public eventTrack(name: string, param: any): void {}
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [],
            imports: [
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
                            BrowserDetectionService,
                            { provide: LanguageService, useClass: MockLanguageService },
                            { provide: StreetSettingsService, useClass: MockStreetSettingsService },
                            { provide: Angulartics2GoogleAnalytics, useClass: MockAngulartics }
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
        expect(componentInstance.streetSettingsServiceSubscribe).toBeDefined();

        spyOn(componentInstance.getTranslationSubscribe, 'unsubscribe');
        spyOn(componentInstance.familyHeaderServiceSubscribe, 'unsubscribe');
        spyOn(componentInstance.streetSettingsServiceSubscribe, 'unsubscribe');

        componentInstance.ngOnDestroy();

        expect(componentInstance.getTranslationSubscribe.unsubscribe).toHaveBeenCalled();
        expect(componentInstance.familyHeaderServiceSubscribe.unsubscribe).toHaveBeenCalled();
        expect(componentInstance.streetSettingsServiceSubscribe.unsubscribe).toHaveBeenCalled();
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
