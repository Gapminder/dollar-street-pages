import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location, LocationStrategy } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { SpyLocation } from '@angular/common/testing';
import { HttpModule } from '@angular/http';
import { TranslateModule } from 'ng2-translate';
import { Angulartics2Module, Angulartics2 } from 'angulartics2';
import {
    MathService,
    LanguageService,
    UrlChangeService
} from '../../../common';
import {
    LanguageServiceMock,
    UrlChangeServiceMock,
    AngularticsMock
} from '../../../test/';
import { PhotographerProfileService } from '../photographer-profile.service';
import { PhotographerProfileComponent } from '../photographer-profile.component';

describe('PhotographerProfileComponent', () => {
    let fixture: ComponentFixture<PhotographerProfileComponent>;
    let component: PhotographerProfileComponent;

    class PhotographerProfileServiceMock {
        /* tslint:disable-next-line */
        public getPhotographerProfile(query: string): Observable<any> {
            return Observable.of({data: {firstName: 'John', lastName: 'Travolta'}});
        }
    }

    beforeEach(async() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule,
                TranslateModule,
                Angulartics2Module
            ],
            declarations: [PhotographerProfileComponent],
            providers: [
                Location,
                LocationStrategy,
                MathService,
                { provide: UrlChangeService, useClass: UrlChangeServiceMock },
                { provide: PhotographerProfileService, useClass: PhotographerProfileServiceMock },
                { provide: Location, useClass: SpyLocation },
                { provide: LanguageService, useClass: LanguageServiceMock },
                { provide: Angulartics2, useClass: AngularticsMock }
            ]
        });

        fixture = TestBed.createComponent(PhotographerProfileComponent);
        component = fixture.componentInstance;
    });

    it('ngOnInit(), ngOnDestroy()', () => {
        component.ngOnInit();

        expect(component.getTranslationSubscribe).toBeDefined();
        expect(component.photographerProfileServiceSubscribe).toBeDefined();

        spyOn(component.getTranslationSubscribe, 'unsubscribe');
        spyOn(component.photographerProfileServiceSubscribe, 'unsubscribe');

        component.ngOnDestroy();

        expect(component.getTranslationSubscribe.unsubscribe).toHaveBeenCalled();
        expect(component.photographerProfileServiceSubscribe.unsubscribe).toHaveBeenCalled();
    });

    it('isShowInfoMore()', () => {
        component.ngOnInit();

        expect(component.isShowInfoMore({})).toBeFalsy();
    });
});
