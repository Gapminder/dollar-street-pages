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
    StreetSettingsActions,
    ActiveThingService
} from '../../common';
import { Observable } from 'rxjs/Observable';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MapComponent } from '../map.component';
import { MapService } from '../map.service';
import { mockMapData } from './mock.data';

describe('MapComponent', () => {
    let componentInstance: MapComponent;
    let componentFixture: ComponentFixture<MapComponent>;

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

    class MockAngulartics {
        // tslint:disable-next-line
        public eventTrack(name: string, param: any): void {}
    }

    class MockLanguageService {
        public getTranslation(): Observable<any> {
            return Observable.of('the world');
        }

         public getLanguageParam(): string {
            return '&lang=en';
        }
    }

    class MockMapService {
        public getMainPlaces(): Observable<any> {
            return Observable.of({err: undefined, data: { mockMapData }});
        }
    }

    class MockLoaderService {
        // tslint:disable-next-line
        public setLoader(b: boolean): void {}
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
                        StoreModule.provideStore({}),
                        EffectsModule.run(StreetSettingsEffects),
                        RouterTestingModule.withRoutes([{path: '', component: BlankComponent}])
                     ],
            providers: [
                            MathService,
                            UrlChangeService,
                            BrowserDetectionService,
                            StreetSettingsActions,
                            ActiveThingService,
                            { provide: StreetSettingsService, useClass: MockStreetSettingsService },
                            { provide: LoaderService, useClass: MockLoaderService },
                            { provide: MapService, useClass: MockMapService },
                            { provide: Angulartics2GoogleAnalytics, useClass: MockAngulartics },
                            { provide: LanguageService, useClass: MockLanguageService }
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
