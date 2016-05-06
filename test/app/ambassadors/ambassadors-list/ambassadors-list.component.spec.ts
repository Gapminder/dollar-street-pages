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
  let context, fixture, nativeElement;
  beforeEach(async(inject([TestComponentBuilder], (tcb:any) => {
    return tcb.createAsync(AmbassadorsListComponent).then((fixtureInst:any) => {
      fixture = fixtureInst;
      context = fixture.debugElement.componentInstance;
      nativeElement = fixture.debugElement.nativeElement;
    });
  })));
  it('AmbassadorsComponent must init ', ()=> {
    fixture.detectChanges();
    expect(context.ambassadorsList.length).toEqual(3);
  });
  it('AmbassadorsComponent people render by right title ', ()=> {
    fixture.detectChanges();
    let sectionHeaders = nativeElement.querySelectorAll('.ambassadors-peoples h2');
    expect(sectionHeaders[0].innerHTML).toEqual('Teachers');
    expect(sectionHeaders[1].innerHTML).toEqual('Writers');
    expect(sectionHeaders[2].innerHTML).toEqual('Organisations');
  });
  it('AmbassadorsComponent show more ', ()=> {
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
});
