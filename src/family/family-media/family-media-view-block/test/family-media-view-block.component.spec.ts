import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component }    from '@angular/core';

import { FamilyMediaViewBlockComponent } from '../family-media-view-block.component';
import { FamilyMediaViewBlockService } from '../family-media-view-block.service';

import { Observable } from 'rxjs/Observable';

import { RouterTestingModule } from '@angular/router/testing';

import { TranslateModule, TranslateLoader } from 'ng2-translate';

import { TranslateMeComponent } from '../../../../shared';

import { mockFamilyMediaText } from './mock.data';

import {
         LanguageService,
         StreetSettingsService,
         BrowserDetectionService
       } from '../../../../common';

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

    class MockLanguageService {
        public getTranslation(): Observable<any> {
            return Observable.of('the world');
        }

        public getLanguageParam(): string {
            return '&lang=en';
        }
    }

    class MockStreetSettingsService {
        public getStreetSettings(): Observable<any> {
            let context: any = {_id:'57963211cc4aaed63a02504c',showDividers:false,low:30,medium:300,high:3000,poor:26,rich:15000,lowDividerCoord:78,mediumDividerCoord:490,highDividerCoord:920,__v:0};
            let response: any = {success:true,error:false,msg:[],data:context};

            return Observable.of(response);
        }
    }

    @Component({
        template: ''
    })
    class BlankComponent { }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                        RouterTestingModule.withRoutes([{path: '', component: BlankComponent}]),
                        TranslateModule.forRoot({
                            provide: TranslateLoader,
                            useClass: CustomLoader
                        })
                     ],
            declarations: [ FamilyMediaViewBlockComponent, BlankComponent, TranslateMeComponent ],
            providers: [
                            FamilyMediaViewBlockService,
                            BrowserDetectionService,
                            { provide: LanguageService, useClass: MockLanguageService },
                            { provide: StreetSettingsService, useClass: MockStreetSettingsService }
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

        expect(componentInstance.streetServiceSubscribe).toBeDefined();

        spyOn(componentInstance.streetServiceSubscribe, 'unsubscribe');

        componentInstance.ngOnDestroy();

        expect(componentInstance.streetServiceSubscribe.unsubscribe).toHaveBeenCalled();
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
