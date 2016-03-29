import {
  it,
  inject,
  injectAsync,
  beforeEachProviders,
  TestComponentBuilder
} from 'angular2/testing';

import {AppComponent} from './app.component';

describe('App', () => {
 // beforeEachProviders(() => [AppComponent]);

  it('should have default type', inject([AppComponent], (appComponent:AppComponent) => {
    // expect(appComponent.type).toEqual('app component');
    expect(appComponent.type).toEqual('app component');
  }));
});
