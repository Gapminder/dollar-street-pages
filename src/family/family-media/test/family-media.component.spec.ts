import {
    ComponentFixture,
    TestBed
} from '@angular/core/testing';

import { By }              from '@angular/platform-browser';
import { DebugElement, Component }    from '@angular/core';

import { SpyLocation } from '@angular/common/testing';

import { Location } from '@angular/common';

import { Observable } from 'rxjs/Observable';

import { FamilyModule } from '../../family.module';

import {
    UrlChangeService,
    LanguageService,
    BrowserDetectionService,
    LoaderService,
    UtilsService
} from '../../../common';

/*tslint:disable-next-line*/
import { FamilyComponent } from '../../family.component';
import { FamilyMediaComponent } from '../family-media.component';
import { FamilyMediaService } from '../family-media.service';

import { mockFamilyMediaData } from './mock.component.data';

describe('FamilyMediaComponent', () => {
    let componentInstance: FamilyMediaComponent;
    let componentFixture: ComponentFixture<FamilyMediaComponent>;
    let debugElement: DebugElement;
    let nativeElement: HTMLElement;

    let urlChangeService: UrlChangeService;

    @Component({
        template: ''
    })
    class BlankComponent { }

    class MockLanguageService {
        public getTranslation(): Observable<any> {
            return Observable.of('the world');
        }

        public getLanguageParam(): string {
            return '&lang=en';
        }
    }

    class MockFamilyMediaService {
        /* tslint:disable */
        public getFamilyMedia(query: string): Observable<any> {
            let response: any = {success:true,data:mockFamilyMediaData,error:undefined};

            return Observable.of(response);
        }
        /* tslint:enable */
    }

    beforeEach((() => {
        TestBed.configureTestingModule({
            imports: [
                        FamilyModule
                     ],
            declarations: [ BlankComponent ],
            providers: [
                            UrlChangeService,
                            BrowserDetectionService,
                            LoaderService,
                            SpyLocation,
                            UtilsService,
                            { provide: FamilyMediaService, useClass: MockFamilyMediaService },
                            { provide: LanguageService, useClass: MockLanguageService },
                            { provide: Location, useClass: SpyLocation }
                        ]
        }).compileComponents();

        componentFixture = TestBed.createComponent(FamilyMediaComponent);

        componentInstance = componentFixture.componentInstance;
        debugElement = componentFixture.debugElement.query(By.css('div'));
        nativeElement = debugElement.nativeElement;

        urlChangeService = TestBed.get(UrlChangeService);

        componentFixture.detectChanges();
    }));

    it('ngAfterViewInit() ngOnDestroy()', (() => {
        componentFixture.whenStable().then(() => {
            expect(componentInstance.familyMediaService).toBeDefined();
            expect(componentInstance.languageService).toBeDefined();
            expect(componentInstance.loaderService).toBeDefined();
            expect(componentInstance.device).toBeDefined();

            expect(componentInstance.images).toBeDefined();

            expect(componentInstance.isDesktop).toBeTruthy();

            spyOn(componentInstance.familyPlaceServiceSubscribe, 'unsubscribe');
            spyOn(componentInstance.resizeSubscribe, 'unsubscribe');

            componentInstance.ngOnDestroy();

            expect(componentInstance.familyPlaceServiceSubscribe.unsubscribe).toHaveBeenCalled();
            expect(componentInstance.resizeSubscribe.unsubscribe).toHaveBeenCalled();
        });
    }));

    it('openMedia()', (() => {
        componentFixture.whenStable().then(() => {
            componentInstance.goToRow = (row: number) => {
                return row;
            };

            componentInstance.openMedia(componentInstance.images[0], 0);

            expect(componentInstance.imageData.imageId).toEqual(componentInstance.images[0]._id);
        });
    }));
});
