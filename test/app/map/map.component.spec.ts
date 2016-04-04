/**
 * Created by igor on 4/4/16.
 */
import {
  it,
  describe,
  expect,
  injectAsync,
  beforeEachProviders,
  TestComponentBuilder,
} from 'angular2/testing';

import {MockCommonDependency} from '../../app/common-mocks/mocked.services'
import {MapComponent} from '../../../app/map/map.component';


describe("PhotographersComponent", () => {
  beforeEachProviders(() => {
    let mockCommonDependency=new MockCommonDependency();
    return [
      mockCommonDependency.getProviders()
    ];
  });
  it("AllPhotographersComponent must init ", injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(MapComponent).then((fixture) => {
    
    })
  }));
});
