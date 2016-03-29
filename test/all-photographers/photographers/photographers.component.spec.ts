import {
  it,
  describe,
  expect,
  inject,
  injectAsync,
  afterEach,
  beforeEachProviders,
  TestComponentBuilder,
} from 'angular2/testing';

import {MockPhotographersService} from "./mocks/photographers.service";
import {PhotographersComponent} from '../../../app/all-photographers/photographers/photographers.component.ts';

describe("PhotographersComponent", () => {
  let mockPhotographersService:MockPhotographersService;
  beforeEachProviders(() => {
    mockPhotographersService = new MockPhotographersService();
    return [
      mockPhotographersService.getProviders()
    ];
  })
  it("retrieves the artist", injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(PhotographersComponent).then((fixture) =>{
      //console.log(fixture)
      let photographersComponent = fixture.debugElement.componentInstance;
      photographersComponent.ngOnInit()
      console.log(photographersComponent.photographersByCountry)
    })
  }))

})
