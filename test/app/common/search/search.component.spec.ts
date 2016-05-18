import {
  it,
  describe,
  inject,
  async,
  beforeEachProviders,
  beforeEach
} from '@angular/core/testing';
import {
  TestComponentBuilder
} from '@angular/compiler/testing';

import {MockCommonDependency} from '../../../app/common-mocks/mocked.services';
import {MockService} from '../../common-mocks/mock.service.template.ts';
import {SearchComponent} from '../../../../app/common/search/search.component';
import {initData, sliderInitData} from './mocks/data.ts';
let tmpl = require('./mocks/mock.search.template.html');
describe('SearchComponent', () => {
  let place = {
    _id: '546ccf730f7ddf45c0179641',
    image: '546ccf730f7ddf45c0179641'
  };
  let streetPlaces = new MockService();
  streetPlaces.serviceName = 'SearchService';
  streetPlaces.getMethod = 'getSearchInitData';
  let chosenPlaces = new MockService();
  chosenPlaces.fakeResponse = place;
  beforeEachProviders(() => {
    let mockCommonDependency = new MockCommonDependency();
    return [
      mockCommonDependency.getProviders(),
      streetPlaces.getProviders()
    ];
  });
  let context;
  let fixture;

  beforeEach(async(inject([TestComponentBuilder], (tcb:any) => {
      return tcb
        .overrideTemplate(SearchComponent, tmpl)
        .createAsync(SearchComponent)
        .then((componentFixture:any) => {
          fixture = componentFixture;
          context = componentFixture.debugElement.componentInstance;
          context.chosenPlaces = chosenPlaces;
        });
    }
  )));

  it(' ngOnInit ngOnDestroy', () => {
    context.placeComponent = true;
    spyOn(context, 'getInitDataForSlider');
    context.ngOnInit();
    expect(context.paramsUrl).toEqual({
      thing: context.activeThing._id,
      place: place._id,
      image: place.image
    });
    expect(context.getInitDataForSlider).toHaveBeenCalled();
    spyOn(context.chosenPlacesSubscribe, 'unsubscribe');
    context.ngOnDestroy();
    expect(context.chosenPlacesSubscribe.unsubscribe).toHaveBeenCalled();
  });

  it(' ngOnChanges', () => {
    spyOn(context, 'ngOnChanges').and.callThrough();
    spyOn(context, 'parseUrl');
    spyOn(context, 'getInitData');
    context.ngOnChanges({url: {currentValue: 'thing=5477537786deda0b00d43be5&place=54b6866a38ef07015525f5be&image=54b6862f3755cbfb542c28cb'}});
    expect(context.getInitData).toHaveBeenCalledWith();
  });
  it(' goToThing', () => {
    spyOn(context, 'goToThing').and.callThrough();
    context.paramsUrl = {
      thing: '5477537786deda0b00d43be5',
      place: '54b6866a38ef07015525f5be',
      image: '54b6862f3755cbfb542c28cb'
    };
    context.defaultThing = {_id: '5477537786deda0b00d43333'};
    spyOn(context, 'getInitData');
    context.goToThing();
    expect(context.paramsUrl.thing).toEqual('5477537786deda0b00d43333');
    expect(context.getInitData).toHaveBeenCalledWith();
  });

  it(' openSearch', () => {
    spyOn(context, 'openSearch').and.callThrough();
    context.openSearch(false);
    expect(context.isOpen).toEqual(true);
    expect(context.search.text).toEqual('');
    expect(context.modalPosition).toEqual('0px');
  });

  it(' goToRegions', () => {
    spyOn(context, 'goToRegions').and.callThrough();
    context.activeRegions = ['World'];
    context.paramsUrl = {
      thing: '5477537786deda0b00d43be5',
      place: '54b6866a38ef07015525f5be',
      image: '54b6862f3755cbfb542c28cb'
    };
    spyOn(context, 'getInitData');
    context.goToRegions('Europe');
    expect(context.activeRegions).toEqual(['Europe']);
    expect(context.paramsUrl.regions).toEqual(['Europe']);
    expect(context.getInitData).toHaveBeenCalledWith();
    context.goToRegions('Asia');
    expect(context.activeRegions).toEqual(['Europe', 'Asia']);
    expect(context.paramsUrl.regions).toEqual(['Europe', 'Asia']);
    expect(context.getInitData).toHaveBeenCalledWith();
  });

  it(' goToCountries', () => {
    spyOn(context, 'goToCountries').and.callThrough();
    context.activeCountries = ['World'];
    context.paramsUrl = {
      thing: '5477537786deda0b00d43be5',
      place: '54b6866a38ef07015525f5be',
      image: '54b6862f3755cbfb542c28cb'
    };
    spyOn(context, 'getInitData');
    context.goToCountries({country: 'Bolivia', empty: false});
    expect(context.activeCountries).toEqual(['Bolivia']);
    expect(context.paramsUrl.countries).toEqual(['Bolivia']);
    expect(context.getInitData).toHaveBeenCalledWith();
    context.goToCountries({country: 'Ukraine', empty: false});
    expect(context.activeCountries).toEqual(['Bolivia', 'Ukraine']);
    expect(context.paramsUrl.countries).toEqual(['Bolivia', 'Ukraine']);
    expect(context.getInitData).toHaveBeenCalledWith();
  });

  it(' removeItemFromState', () => {
    spyOn(context, 'removeItemFromState').and.callThrough();
    context.activeRegions = ['Europe'];
    context.activeCountries = ['Bolivia'];
    context.paramsUrl = {
      thing: '5477537786deda0b00d43be5',
      place: '54b6866a38ef07015525f5be',
      image: '54b6862f3755cbfb542c28cb'
    };
    spyOn(context, 'getInitData');
    context.removeItemFromState('Bolivia');
    expect(context.activeCountries).toEqual(['World']);
    expect(context.activeRegions).toEqual(['Europe']);
    expect(context.paramsUrl.countries).toEqual(['World']);
    expect(context.paramsUrl.regions).toEqual(['Europe']);
    expect(context.getInitData).toHaveBeenCalledWith();
    context.removeItemFromState('Europe');
    expect(context.activeCountries).toEqual(['World']);
    expect(context.activeRegions).toEqual(['World']);
    expect(context.paramsUrl.countries).toEqual(['World']);
    expect(context.paramsUrl.regions).toEqual(['World']);
    expect(context.getInitData).toHaveBeenCalledWith();
  });

  it('getInitData', () => {
    streetPlaces.fakeResponse = initData;
    context.isDesktop = true;
    spyOn(context, 'getInitData').and.callThrough();
    spyOn(context.searchService, 'getSearchInitData').and.callThrough();
    spyOn(context.selectedFilter, 'emit');
    spyOn(context.selectedThing, 'emit');
    context.paramsUrl = {
      thing: '5477537786deda0b00d43be5',
      place: '54b6866a38ef07015525f5be',
      image: '54b6862f3755cbfb542c28cb',
      countries: ['France', 'Ukraine'],
      regions: ['Asia'],
      zoom: 5,
      row: 1
    };
    context.matrixComponent = true;
    context.getInitData(true);
    expect(context.isOpen).toEqual(false);
    expect(context.searchService.getSearchInitData.calls.argsFor(0))
      .toEqual([`thing=${context.paramsUrl.thing}&countries=${context.paramsUrl.countries.join()}&regions=${context.paramsUrl.regions.join()}&zoom=${context.paramsUrl.zoom}&row=${context.paramsUrl.row}`]);
    context.matrixComponent = false;
    context.mapComponent = true;
    context.getInitData(true);
    expect(context.isOpen).toEqual(false);
    expect(context.searchService.getSearchInitData.calls.argsFor(1))
      .toEqual([`thing=${context.paramsUrl.thing}&countries=World&regions=World`]);
    context.matrixComponent = false;
    context.mapComponent = false;
    context.placeComponent = true;
    streetPlaces.fakeResponse = sliderInitData;
    context.getInitData(true);
    expect(context.isOpen).toEqual(false);
    expect(context.searchService.getSearchInitData.calls.argsFor(2))
      .toEqual([`thing=${context.paramsUrl.thing}&place=${context.paramsUrl.place}&image=${context.paramsUrl.image}`]);
  });
  it('getInitDataForSlider', () => {
    streetPlaces.fakeResponse = sliderInitData;
    spyOn(context, 'getInitDataForSlider').and.callThrough();
    spyOn(context.searchService, 'getSearchInitData').and.callThrough();
    context.paramsUrl = {
      thing: '5477537786deda0b00d43be5',
      place: '54b6866a38ef07015525f5be',
      image: '54b6862f3755cbfb542c28cb'
    };
    context.getInitDataForSlider();
    expect(context.isOpen).toEqual(false);
    expect(context.searchService.getSearchInitData.calls.argsFor(0))
      .toEqual([`thing=${context.paramsUrl.thing}&image=${context.paramsUrl.image}`]);
  });
  it('toUrl', () => {
    spyOn(context, 'toUrl').and.callThrough();
    expect(context.toUrl('http://some.com')).toEqual('url("http://some.com")');
  });

  it('getMobileTitle', () => {
    spyOn(context, 'getMobileTitle').and.callThrough();
    let thing = {
      _id: '546ccf730f7ddf45c0179649',
      icon: '546ccf730f7ddf45c0179649.svg',
      plural: 'Chickens',
      name: 'Chickens',
      category: 'Agriculture'
    };
    let states = ['World'];

    expect(context.getMobileTitle(thing, states)).toEqual(`${thing.plural} by income`);
    states = ['Asia', 'Cambodia'];
    expect(context.getMobileTitle(thing, states)).toEqual(`${thing.plural} (${states.length} countries)`);
    states = ['Cambodia'];
    expect(context.getMobileTitle(thing, states)).toEqual(`${thing.plural} (${states.length} country)`);
  });

  it(' parseUrl', () => {
    spyOn(context, 'parseUrl').and.callThrough();
    context.matrixComponent = true;
    let url = 'thing=5477537786deda0b00d43be5&countries=France,Ukraine&regions=Asia&zoom=5&row=1';
    let urlObj = context.parseUrl(url);
    expect(urlObj.thing).toEqual('5477537786deda0b00d43be5');
    expect(urlObj.countries).toEqual(['France', 'Ukraine']);
    expect(urlObj.regions).toEqual(['Asia']);
    expect(urlObj.zoom).toEqual('5');
    expect(urlObj.row).toEqual('1');
  });

  it(' getLocations', () => {
    let countries = ['France', 'Ukraine'];
    let regions = ['Asia', 'Europe'];
    let spy = spyOn(context, 'getUnique');
    spy.and.callFake(() => {
      return ['Asia', 'Europe', 'France', 'Ukraine'];
    });
    expect(context.getLocations(regions, countries)).toEqual(['Asia', 'Europe', 'France', 'Ukraine']);
    regions = ['World'];
    spy.and.callFake(() => {
      return ['World', 'France', 'Ukraine'];
    });
    expect(context.getLocations(regions, countries)).toEqual(['France', 'Ukraine']);
    countries = ['World'];
    spy.and.callFake(() => {
      return ['World', 'World'];
    });
    expect(context.getLocations(regions, countries)).toEqual(['World']);
  });

  it(' getUnique', () => {
    expect(context.getUnique(['Asia', 'Asia', 'Europe', 'Europe', 'France', 'Ukraine']))
      .toEqual(['Asia', 'Europe', 'France', 'Ukraine']);
  });
});

