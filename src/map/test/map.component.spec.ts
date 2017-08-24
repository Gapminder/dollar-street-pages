import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ElementRef, QueryList }    from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService, TranslateParser, TranslateLoader } from "ng2-translate";
import { Angulartics2Module, Angulartics2GoogleAnalytics } from "angulartics2";
import {
    MathService,
    LoaderService,
    UrlChangeService,
    LanguageService,
    StreetSettingsService,
    BrowserDetectionService,
    StreetSettingsEffects,
    ActiveThingService
} from '../../common';
import {
    LanguageServiceMock,
    StreetSettingsServiceMock,
    LoaderServiceMock,
    AngularticsMock,
    BlankComponent,
    BrowserDetectionServiceMock,
    UrlChangeServiceMock,
    Angulartics2GoogleAnalyticsMock,
    TranslateServiceMock,
    TranslateLoaderMock,
    TranslateParserMock
} from '../../test/';
import { Observable } from 'rxjs/Observable';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MapComponent } from '../map.component';
import { MapService } from '../map.service';
import { mockMapData } from './mock.data';

describe('MapComponent', () => {
    let fixture: ComponentFixture<MapComponent>;
    let component: MapComponent;

    class MapServiceMock {
        public getMainPlaces(): Observable<any> {
            return Observable.of({err: undefined, data: { mockMapData }});
        }
    }

    class MockElementRef implements ElementRef {
        public nativeElement: any = {style: {opacity: 0}};
    }

    class MockQueryList extends QueryList<ElementRef> {
        private counter: number = 0;

        public constructor(public components: ElementRef[]) {
            super();
            this.reset(this.components);
        }

        public [Symbol.iterator](): IterableIterator<ElementRef> {
            return this;
        }

        public next(): IteratorResult<ElementRef> {
            if(this.counter < this.components.length) {
                return {
                    done: false,
                    value: this.components[this.counter++]
                };
            } else {
                return {done: true, value: undefined};
            }
        }
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule,
                TranslateModule,
                Angulartics2Module,
                StoreModule.forRoot({}),
                EffectsModule.forRoot([StreetSettingsEffects]),
                RouterTestingModule.withRoutes([{path: '', component: BlankComponent}])
            ],
            providers: [
                MathService,
                ActiveThingService,
                { provide: TranslateService, useClass: TranslateServiceMock },
                { provide: TranslateParser, useClass: TranslateParserMock },
                { provide: TranslateLoader, useClass: TranslateLoaderMock },
                { provide: UrlChangeService, useClass: UrlChangeServiceMock },
                { provide: BrowserDetectionService, useClass: BrowserDetectionServiceMock },
                { provide: StreetSettingsService, useClass: StreetSettingsServiceMock },
                { provide: LoaderService, useClass: LoaderServiceMock },
                { provide: MapService, useClass: MapServiceMock },
                { provide: Angulartics2GoogleAnalytics, useClass: AngularticsMock },
                { provide: LanguageService, useClass: LanguageServiceMock },
                { provide: Angulartics2GoogleAnalytics, useClass: Angulartics2GoogleAnalyticsMock }
            ],
            declarations: [MapComponent, BlankComponent]
        });

        fixture = TestBed.createComponent(MapComponent);
        component = fixture.componentInstance;

        component.mapColor = new ElementRef({});
    });

    it('ngOnInit() ngOnDestroy()', () => {
        fixture.whenStable().then(() => {
            component.ngOnInit();

            expect(component.getTranslationSubscribe).toBeDefined();
            expect(component.queryParamsSubscribe).toBeDefined();

            spyOn(component.getTranslationSubscribe, 'unsubscribe');

            component.ngOnDestroy();

            expect(component.getTranslationSubscribe.unsubscribe).toHaveBeenCalled();
        });
    });

    it('urlChanged()', () => {
        fixture.whenStable().then(() => {
            component.ngOnInit();
            component.mapColor = new ElementRef({});

            component.urlChanged({url: 'http://dollar-street.org'});

            component.ngOnDestroy();
        });
    });

    it('hoverOnMarker()', () => {
        fixture.whenStable().then(() => {
            component.ngOnInit();

            component.places = mockMapData.places;
            component.markers =  new MockQueryList([new ElementRef({}), new ElementRef({})]);
            component.hoverPortrait = new MockElementRef();

            component.hoverPortraitTop = 5;

            let country: any = component.places[0];

            component.hoverOnMarker(0, country, 'Burundi');

            expect(component.onMarker).toBeTruthy();
            expect(component.currentCountry).toEqual(country);

            component.ngOnDestroy();
        });
    });

    it('hoverOnMarkerTablet()', () => {
        fixture.whenStable().then(() => {
            component.ngOnInit();

            component.places = mockMapData.places;
            component.markers =  new MockQueryList([new ElementRef({}), new ElementRef({})]);

            let country: any = component.places[0];

            component.isDesktop = false;
            component.isMobile = false;

            component.hoverOnMarkerTablet(0, country, 'Burundi');

            expect(component.hoverPlace).toBeDefined();

            component.ngOnDestroy();
        });
    });

    it('unHoverOnMArker()', () => {
        fixture.whenStable().then(() => {
            component.ngOnInit();

            component.isMobile = false;

            component.unHoverOnMarker();

            expect(component.onMarker).toBeFalsy();

            component.ngOnDestroy();
        });
    });

    it('mobileClickOnMarker()', () => {
        fixture.whenStable().then(() => {
            component.ngOnInit();

            component.places = mockMapData.places;
            component.markers =  new MockQueryList([new ElementRef({}), new ElementRef({})]);

            let country: any = component.places[0];

            component.mobileClickOnMarker(country, 'Burundi');

            expect(component.currentCountry).toEqual(country);
            expect(component.originCurrentCountry).toEqual('Burundi');

            component.ngOnDestroy();
        });
    });
});
