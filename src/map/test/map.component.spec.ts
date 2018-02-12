import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef, QueryList } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Angulartics2Module } from 'angulartics2';
import { LanguageService, MathService, UrlChangeService } from '../../common';
import { BlankComponentStub, LanguageServiceMock, UrlChangeServiceMock } from '../../test/';
import { Observable } from 'rxjs/Observable';
import { StoreModule } from '@ngrx/store';
import { MapComponent } from '../map.component';
import { MapService } from '../map.service';
import { mockMapData } from './mock.data';
import { CommonServicesTestingModule } from '../../test/commonServicesTesting.module';
import { TranslateTestingModule } from '../../test/translateTesting.module';
import { UrlParametersServiceMock } from "../../test/mocks/url-parameters.service.mock";
import { UrlParametersService } from "../../url-parameters/url-parameters.service";

// TODO http call somwhere here
describe('MapComponent', () => {
  let fixture: ComponentFixture<MapComponent>;
  let component: MapComponent;

  class MapServiceMock {
    public getMainPlaces(): Observable<any> {
      return Observable.of({err: undefined, data: {mockMapData}});
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
      if (this.counter < this.components.length) {
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
        Angulartics2Module,
        StoreModule.forRoot({}),
        RouterTestingModule.withRoutes([{path: '', component: BlankComponentStub}]),
        CommonServicesTestingModule
      ],
      providers: [
        { provide: MapService, useClass: MapServiceMock }
      ],
      declarations: [MapComponent, BlankComponentStub]
    });

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;

    component.mapColor = new ElementRef({});
  });

  it('ngOnInit() ngOnDestroy()', () => {
    fixture.whenStable().then(() => {
      component.ngOnInit();

      expect(component.getTranslationSubscribe).toBeDefined();

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
      component.markers = new MockQueryList([new ElementRef({}), new ElementRef({})]);
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
      component.markers = new MockQueryList([new ElementRef({}), new ElementRef({})]);

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
      component.markers = new MockQueryList([new ElementRef({}), new ElementRef({})]);

      let country: any = component.places[0];

      component.mobileClickOnMarker(country, 'Burundi');

      expect(component.currentCountry).toEqual(country);
      expect(component.originCurrentCountry).toEqual('Burundi');

      component.ngOnDestroy();
    });
  });
});
