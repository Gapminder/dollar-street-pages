/**
 * Created by igor on 3/30/16.
 */
import {
  it,
  describe,
  xdescribe,
  expect,
  injectAsync,
  beforeEachProviders,
  TestComponentBuilder,
} from 'angular2/testing';

import {MockCommonDependency} from '../../../app/common-mocks/mocked.services';
import {MockService} from '../../../app/common-mocks/mock.service.template';
import {ambassadors} from '../mocks/data.ts';

import {AmbassadorsListComponent} from '../../../../app/ambassadors/ambassadors-list/ambassadors-list.component';

describe('PhotographersComponent', () => {
  let mockAmbassadorsService = new MockService();
  mockAmbassadorsService.serviceName = 'AmbassadorsListService';
  mockAmbassadorsService.getMethod = 'getAmbassadors';
  mockAmbassadorsService.fakeResponse = ambassadors;
  let mockCommonDependency = new MockCommonDependency();
  beforeEachProviders(() => {
    return [
      mockCommonDependency.getProviders(),
      mockAmbassadorsService.getProviders()
    ];
  });
  it('AmbassadorsComponent must init ', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(AmbassadorsListComponent).then((fixture) => {
      let context = fixture.debugElement.componentInstance;
      fixture.detectChanges();
      expect(context.ambassadorsList.length).toEqual(3);
    });
  }));
  it('AmbassadorsComponent people render by right title ', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(AmbassadorsListComponent).then((fixture) => {
      let context = fixture.debugElement.componentInstance;
      let nativeElement = fixture.debugElement.nativeElement;
      fixture.detectChanges();
      let sectionHeaders = nativeElement.querySelectorAll('.ambassadors-peoples h2');
      expect(sectionHeaders[0].innerHTML).toEqual('Teachers');
      expect(sectionHeaders[1].innerHTML).toEqual('Writers');
      expect(sectionHeaders[2].innerHTML).toEqual('Organisations');
    });
  }));
  it('AmbassadorsComponent show more ', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(AmbassadorsListComponent).then((fixture) => {
      let context = fixture.debugElement.componentInstance;
      let nativeElement = fixture.debugElement.nativeElement;
      fixture.detectChanges();

      let sections = nativeElement.querySelectorAll('.ambassadors-peoples:first-child .ambassadors-people');
      let showMore = nativeElement.querySelectorAll('.custom-button');
      for (let section of sections) {
        expect(section.classList.contains('show')).toEqual(false);
      }
      expect(showMore[0].innerHTML).toEqual('View More &gt;&gt;');
      showMore[0].click();
      fixture.detectChanges();
      expect(showMore[0].innerHTML).toEqual('View Less &lt;&lt;');
      for (let section of sections) {
        expect(section.classList.contains('show')).toEqual(true);
      }
    });
  }));
});
