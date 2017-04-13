import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';

import { Observable } from 'rxjs/Observable';

import { SpyLocation } from '@angular/common/testing';

import { HttpModule } from '@angular/http';

import { MathService, LanguageService, UrlChangeService } from '../../../common';

import { PhotographerProfileService } from '../photographer-profile.service';
import { PhotographerProfileComponent } from '../photographer-profile.component';

describe('PhotographerProfileComponent', () => {
    let componentInstance: PhotographerProfileComponent;
    let componentFixture: ComponentFixture<PhotographerProfileComponent>;

    class MockUserLanguageService {
        public getTranslation(): Observable<any> {
            return Observable.of({PHOTOGRAPHER: 'Photograper', SHOW_DETAILS: 'Show Details', HIDE_DETAILS: 'Hide details'});
        }

        public getLanguageParam(): string {
            return 'lang=en';
        }
    }

    class MockPhotographerProfileService {
        public getPhotographerProfile(query: string): Observable<any> {
            return Observable.of({data: {firstName: 'John', lastName: 'Travolta'}});
        }
    }

    beforeEach(async() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            declarations: [PhotographerProfileComponent],
            providers: [
                Location,
                LocationStrategy,
                MathService,
                UrlChangeService,
                { provide: PhotographerProfileService, useClass: MockPhotographerProfileService },
                { provide: Location, useClass: SpyLocation },
                { provide: LanguageService, useClass: MockUserLanguageService }
            ]
        });

        componentFixture = TestBed.overrideComponent(PhotographerProfileComponent, {
            set: {
                template: ''
            }
        }).createComponent(PhotographerProfileComponent);

        componentInstance = componentFixture.componentInstance;
    });

    it('ngOnInit(), ngOnDestroy()', () => {
        componentInstance.ngOnInit();

        expect(componentInstance.getTranslationSubscribe).toBeDefined();
        expect(componentInstance.photographerProfileServiceSubscribe).toBeDefined();

        spyOn(componentInstance.getTranslationSubscribe, 'unsubscribe');
        spyOn(componentInstance.photographerProfileServiceSubscribe, 'unsubscribe');

        componentInstance.ngOnDestroy();

        expect(componentInstance.getTranslationSubscribe.unsubscribe).toHaveBeenCalled();
        expect(componentInstance.photographerProfileServiceSubscribe.unsubscribe).toHaveBeenCalled();
    });

    it('isShowInfoMore()', () => {
        componentInstance.ngOnInit();

        expect(componentInstance.isShowInfoMore({})).toBeFalsy();
    });
});
