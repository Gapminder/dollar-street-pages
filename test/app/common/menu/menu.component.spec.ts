import { it, describe, async, inject, beforeEach, addProviders, TestComponentBuilder } from '@angular/core/testing';
import { MockCommonDependency } from '../../../app/common-mocks/mocked.services';
import { MainMenuComponent } from '../../../../src/shared/menu/menu.component';

describe('MainMenuComponent', () => {
  let mockCommonDependency = new MockCommonDependency();

  beforeEach(() => {
    addProviders([
      mockCommonDependency.getProviders()
    ]);
  });

  let context;
  let fixture;

  beforeEach(async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    return tcb.createAsync(MainMenuComponent).then((fixtureInst: any) => {
      fixture = fixtureInst;
      context = fixture.debugElement.componentInstance;
    });
  })));

  it('ngOnInit ngOnDestroy', ()=> {
    context.ngOnInit();

    spyOn(context.routerEventsSubscribe, 'unsubscribe');

    context.ngOnDestroy();
    expect(context.routerEventsSubscribe.unsubscribe).toHaveBeenCalled();
  });

  it('openMenu', () => {
    spyOn(context, 'openMenu').and.callThrough();

    context.openMenu(false);

    expect(context.openMenu).toHaveBeenCalledWith(false);

    expect(context.isOpenMenu).toEqual(true);
  });

  it('goToPage', () => {
    spyOn(context, 'goToPage').and.callThrough();

    context.goToPage('/matrix', false);
    expect(context.goToPage).toHaveBeenCalledWith('/matrix', false);

    context.goToPage('/about');
    expect(context.goToPage).toHaveBeenCalledWith('/about');

    context.goToPage('https://www.gapminder.org/category/dollarstreet/');
    expect(context.goToPage).toHaveBeenCalledWith('https://www.gapminder.org/category/dollarstreet/');

    context.goToPage('/map');
    expect(context.goToPage).toHaveBeenCalledWith('/map');

    context.goToPage('https://www.gapminder.org');
    expect(context.goToPage).toHaveBeenCalledWith('https://www.gapminder.org');

    context.goToPage('https://getsatisfaction.com/gapminder');
    expect(context.goToPage).toHaveBeenCalledWith('https://getsatisfaction.com/gapminder');

    context.goToPage('/test');
    expect(context.goToPage).toHaveBeenCalledWith('/test');

    expect(context.isOpenMenu).toEqual(false);
  });

  it('isOutsideMainMenuClick', () => {
    document.body.click();

    spyOn(context, 'isOutsideMainMenuClick').and.callThrough();
  });
});
