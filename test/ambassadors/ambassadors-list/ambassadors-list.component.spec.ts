/**
 * Created by igor on 3/30/16.
 */
import {
  it,
  describe,
  expect,
  injectAsync,
  beforeEachProviders,
  TestComponentBuilder,
} from 'angular2/testing';

import {MockCommonDependency} from '../../common-mocks/mocked.services'
import {MockService} from '../../common-mocks/mock.service.template'
import {ampassadors} from "./mock/data.ts";

import {AmbassadorsListComponent} from '../../../app/ambassadors/ambassadors-list/ambassadors-list.component';

describe("PhotographersComponent", () => {
  let mockAmbassadorsService = new MockService();
  mockAmbassadorsService.fakeResponse=ampassadors;
  let mockCommonDependency = new MockCommonDependency();
  beforeEachProviders(() => {
    return [
      mockCommonDependency.getProviders(),
      mockAmbassadorsService.getProviders(),
    ];
  });
  it("AmbassadorsComponent must init ", injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(AmbassadorsListComponent).then((fixture) => {
      let context = fixture.debugElement.componentInstance;
      fixture.detectChanges();
      expect(context.ambassadorsList.length).toEqual(3)
    })
  }));
});
