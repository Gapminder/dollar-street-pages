import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement, Component }    from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
import {
    LoaderServiceMock,
    BlankComponentStub,
    LanguageServiceMock,
    BrowserDetectionServiceMock,
    UtilsServiceMock,
    UrlChangeServiceMock
} from '../../../test/';

/*tslint:disable-next-line*/
import { FamilyComponent } from '../../family.component';
import { FamilyMediaComponent } from '../family-media.component';
import { FamilyMediaService } from '../family-media.service';

import { mockFamilyMediaData } from './mock.component.data';
import { Store } from '@ngrx/store';
import { PagePositionServiceMock } from "../../../test/mocks/page-position.service.mock";
import { PagePositionService } from "../../../shared/page-position/page-position.service";
import { UrlParametersService } from "../../../url-parameters/url-parameters.service";
import { UrlParametersServiceMock } from "../../../test/mocks/url-parameters.service.mock";
import { RouterTestingModule } from '@angular/router/testing';

describe('FamilyMediaComponent', () => {
    let componentInstance: FamilyMediaComponent;
    let componentFixture: ComponentFixture<FamilyMediaComponent>;
    let debugElement: DebugElement;
    let nativeElement: HTMLElement;

    let urlChangeService: UrlChangeService;

    class FamilyMediaServiceMock {
        /* tslint:disable */
        public getFamilyMedia(query: string): Observable<any> {
            let response: any = {success:true,data:mockFamilyMediaData,error:undefined};

            return Observable.of(response);
        }
        /* tslint:enable */
    }

    class StoreMock {
      select() {
        return Observable.of({
          query: true
        });
      }
    }

    beforeEach((() => {
        TestBed.configureTestingModule({
            imports: [
              FamilyModule,
              RouterTestingModule
                     ],
            declarations: [ BlankComponentStub ],
            providers: [
              SpyLocation,
              { provide: UrlChangeService, useClass: UrlChangeServiceMock },
              { provide: BrowserDetectionService, useClass: BrowserDetectionServiceMock },
              { provide: UtilsService, useClass: UtilsServiceMock },
              { provide: LoaderService, useClass: LoaderServiceMock },
              { provide: FamilyMediaService, useClass: FamilyMediaServiceMock },
              { provide: LanguageService, useClass: LanguageServiceMock },
              { provide: Location, useClass: SpyLocation },
              { provide: Store, useClass: StoreMock},
              { provide: UrlParametersService, useClass: UrlParametersServiceMock },
              { provide: PagePositionService, useClass: PagePositionServiceMock },
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
            // componentInstance.goToRow = (row: number) => {
            //     return row;
            // };

            componentInstance.openMedia(componentInstance.images[0], 0);

            expect(componentInstance.imageData.imageId).toEqual(componentInstance.images[0]._id);
        });
    }));
});
