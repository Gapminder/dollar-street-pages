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
import {photographers} from '../mocks/data.ts';

import {PhotographersComponent} from '../../../../app/all-photographers/photographers/photographers.component.ts';

describe('Photographers Component', () => {
  let mockPhotographersService = new MockService();
  mockPhotographersService.serviceName = 'PhotographersService';
  mockPhotographersService.getMethod = 'getPhotographers';
  mockPhotographersService.fakeResponse = photographers;
  let mockCommonDependency = new MockCommonDependency();
  beforeEachProviders(() => {
    return [
      mockCommonDependency.getProviders(),
      mockPhotographersService.getProviders()
    ];
  });
  let context, fixture, nativeElement;
  beforeEach(async(inject([TestComponentBuilder], (tcb:any) => {
    return tcb.createAsync(PhotographersComponent).then((fixtureInst:any) => {
      fixture = fixtureInst;
      context = fixture.debugElement.componentInstance;
      nativeElement = fixture.debugElement.nativeElement;
    });
  })));
  it('PhotographersComponent must init', ()=> {
    fixture.detectChanges();
    expect(context.photographersByCountry.length).toBe(4);
    expect(context.photographersByName.length).toBe(4);
    expect(context.loader).toBe(true);
    mockPhotographersService.toInitState();
  });
  it('PhotographersComponent must destroy', ()=> {
    fixture.detectChanges();
    fixture.destroy();
    expect(context.photographersServiceSubscribe.countOfSubscribes).toBe(0);
  });
  it('PhotographersComponent must show on mobile', ()=> {
    let searchInput = nativeElement.querySelector('.search-input');
    let sortButton = nativeElement.querySelector('.sort-country');
    expect(searchInput.classList.contains('show')).toBe(false);
    context.toggleLeftSide({target: sortButton});
    expect(searchInput.classList.contains('show')).toBe(true);
    context.toggleLeftSide({target: sortButton});
    expect(searchInput.classList.contains('show')).toBe(false);
  });
  it('PhotographersComponent must render photographers', ()=> {
    fixture.detectChanges();
    let photographerСard = nativeElement.querySelectorAll('.photographer-card');
    let countryCard = nativeElement.querySelectorAll('.country-card');
    expect(photographerСard.length).toBe(4);
    expect(countryCard.length).toBe(4);
    context.search.text = 'Igor Nepipenko';
    fixture.detectChanges();
    photographerСard = nativeElement.querySelectorAll('.photographer-card');
    countryCard = nativeElement.querySelectorAll('.country-card');
    expect(photographerСard.length).toBe(1);
    expect(countryCard.length).toBe(2);
  });
});
