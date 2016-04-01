import {
  it,
  describe,
  expect,
  injectAsync,
  beforeEachProviders,
  TestComponentBuilder,
} from 'angular2/testing';

import {MockCommonDependency} from '../common-mocks/mocked.services'
import {MockService} from '../common-mocks/mock.service.template'
import {mapdata} from "./mocks/data.ts";

import {MapComponent} from '../../app/map/map.component';

describe("MapComponent", () => {
  let mockMapService = new MockService();
  mockMapService.serviceName = 'MapService';
  mockMapService.getMethod = 'getMainPlaces';
  mockMapService.fakeResponse = mapdata;
  let mockCommonDependency = new MockCommonDependency();
  beforeEachProviders(() => {
    return [
      mockCommonDependency.getProviders(),
      mockMapService.getProviders()
    ];
  });
  it("MapComponent must init ", injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(MapComponent).then((fixture) => {
      let context = fixture.debugElement.componentInstance;
      fixture.detectChanges();
      console.log(context.places.length)
      console.log(context.countries.length)
      expect(context.places.length).toEqual(8);
      expect(context.countries.length).toEqual(6);
    })
  }));
  /*it("MapComponent people render by right title ", injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(MapListComponent).then((fixture) => {
      let context = fixture.debugElement.componentInstance;
      let nativeElement = fixture.debugElement.nativeElement;
      fixture.detectChanges();
      let sectionHeaders = nativeElement.querySelectorAll('.ambassadors-peoples h2');
      expect(sectionHeaders[0].innerHTML).toEqual('Teachers');
      expect(sectionHeaders[1].innerHTML).toEqual('Writers');
      expect(sectionHeaders[2].innerHTML).toEqual('Organisations')
    })
  }));
  it("MapComponent show more ", injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(MapListComponent).then((fixture) => {
      let context = fixture.debugElement.componentInstance;
      let nativeElement = fixture.debugElement.nativeElement;
      fixture.detectChanges();

      let sections = nativeElement.querySelectorAll('.ambassadors-peoples:first-child .ambassadors-people');
      let showMore = nativeElement.querySelectorAll('.see-more');

      for (let section of sections){
        expect(section.classList.contains('show')).toEqual(false);
      }
      expect(showMore[0].innerHTML).toEqual('Show more »');
      showMore[0].click();
      fixture.detectChanges();
      expect(showMore[0].innerHTML).toEqual('Show less »');
      for (let section of sections){
        expect(section.classList.contains('show')).toEqual(true);
      }
    })
  }));*/
});
