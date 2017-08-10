import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ElementRef, QueryList }    from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import {
    MathService,
    LoaderService,
    UrlChangeService,
    LanguageService,
    StreetSettingsService,
    BrowserDetectionService,
    Angulartics2GoogleAnalytics,
    StreetSettingsEffects,
    // StreetSettingsActions,
    ActiveThingService
} from '../../common';
import {
    LanguageServiceMock,
    StreetSettingsServiceMock,
    LoaderServiceMock,
    AngularticsMock,
    BlankComponent,
    BrowserDetectionServiceMock,
    UrlChangeServiceMock
} from '../../test/';
import { Observable } from 'rxjs/Observable';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MapComponent } from '../map.component';
import { MapService } from '../map.service';
import { mockMapData } from './mock.data';

describe('MapComponent', () => {
    let componentInstance: MapComponent;
    let componentFixture: ComponentFixture<MapComponent>;

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
                StoreModule.forRoot({}),
                EffectsModule.forFeature([StreetSettingsEffects]),
                RouterTestingModule.withRoutes([{path: '', component: BlankComponent}])
            ],
            providers: [
                MathService,
                // StreetSettingsActions,
                ActiveThingService,
                { provide: UrlChangeService, useClass: UrlChangeServiceMock },
                { provide: BrowserDetectionService, useClass: BrowserDetectionServiceMock },
                { provide: StreetSettingsService, useClass: StreetSettingsServiceMock },
                { provide: LoaderService, useClass: LoaderServiceMock },
                { provide: MapService, useClass: MapServiceMock },
                { provide: Angulartics2GoogleAnalytics, useClass: AngularticsMock },
                { provide: LanguageService, useClass: LanguageServiceMock }
            ],
            declarations: [MapComponent, BlankComponent]
        });

        componentFixture = TestBed.overrideComponent(MapComponent, {
            set: {
                template: '<div></div>'
            }
        }).createComponent(MapComponent);

        TestBed.compileComponents();

        componentInstance = componentFixture.componentInstance;

        componentInstance.mapColor = new ElementRef({});
    });

    it('ngOnInit() ngOnDestroy()', () => {
        componentFixture.whenStable().then(() => {
            componentInstance.ngOnInit();

            expect(componentInstance.getTranslationSubscribe).toBeDefined();
            expect(componentInstance.queryParamsSubscribe).toBeDefined();

            spyOn(componentInstance.getTranslationSubscribe, 'unsubscribe');

            componentInstance.ngOnDestroy();

            expect(componentInstance.getTranslationSubscribe.unsubscribe).toHaveBeenCalled();
        });
    });

    it('urlChanged()', () => {
        componentFixture.whenStable().then(() => {
            componentInstance.ngOnInit();
            componentInstance.mapColor = new ElementRef({});

            componentInstance.urlChanged({url: 'http://dollar-street.org'});

            componentInstance.ngOnDestroy();
        });
    });

    it('hoverOnMarker()', () => {
        componentFixture.whenStable().then(() => {
            componentInstance.ngOnInit();

            componentInstance.places = mockMapData.places;
            componentInstance.markers =  new MockQueryList([new ElementRef({}), new ElementRef({})]);
            componentInstance.hoverPortrait = new MockElementRef();

            componentInstance.hoverPortraitTop = 5;

            let country: any = componentInstance.places[0];

            componentInstance.hoverOnMarker(0, country, 'Burundi');

            expect(componentInstance.onMarker).toBeTruthy();
            expect(componentInstance.currentCountry).toEqual(country);

            componentInstance.ngOnDestroy();
        });
    });

    it('hoverOnMarkerTablet()', () => {
        componentFixture.whenStable().then(() => {
            componentInstance.ngOnInit();

            componentInstance.places = mockMapData.places;
            componentInstance.markers =  new MockQueryList([new ElementRef({}), new ElementRef({})]);

            let country: any = componentInstance.places[0];

            componentInstance.isDesktop = false;
            componentInstance.isMobile = false;

            componentInstance.hoverOnMarkerTablet(0, country, 'Burundi');

            expect(componentInstance.hoverPlace).toBeDefined();

            componentInstance.ngOnDestroy();
        });
    });

    it('unHoverOnMArker()', () => {
        componentFixture.whenStable().then(() => {
            componentInstance.ngOnInit();

            componentInstance.isMobile = false;

            componentInstance.unHoverOnMarker();

            expect(componentInstance.onMarker).toBeFalsy();

            componentInstance.ngOnDestroy();
        });
    });

    it('mobileClickOnMarker()', () => {
        componentFixture.whenStable().then(() => {
            componentInstance.ngOnInit();

            componentInstance.places = mockMapData.places;
            componentInstance.markers =  new MockQueryList([new ElementRef({}), new ElementRef({})]);

            let country: any = componentInstance.places[0];

            componentInstance.mobileClickOnMarker(country, 'Burundi');

            expect(componentInstance.currentCountry).toEqual(country);
            expect(componentInstance.originCurrentCountry).toEqual('Burundi');

            componentInstance.ngOnDestroy();
        });
    });
});
