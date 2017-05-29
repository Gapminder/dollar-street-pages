import { it, describe, async, inject, beforeEach, addProviders, TestComponentBuilder } from '@angular/core/testing';
import { MockCommonDependency } from '../../../../app/common-mocks/mocked.services';
import { BubbleComponent } from '../../../../../src/shared/guide/bubble/bubble.component';

describe('BubbleComponent', () => {
  let mockCommonDependency = new MockCommonDependency();
  let coordinates: any = {
    width: 50,
    height: 50,
    left: 50,
    top: 50
  };
  beforeEach(() => {
    addProviders([
      mockCommonDependency.getProviders()
    ]);
  });

  let context;
  let fixture;

  beforeEach(async(inject([TestComponentBuilder], (tcb: any) => {
    return tcb.createAsync(BubbleComponent).then((fixtureInst: any) => {
      fixture = fixtureInst;
      context = fixture.debugElement.componentInstance;
      context.bubbles = [{
        _id: '57835fbd4f8d95cb1f62c71a',
        description: 'We all have the same needs, but can afford different solutions. Select from 100 topics. The everyday life looks surprisingly similar for people on the same income level across cultures and continents.',
        header: 'Everyone needs to eat, sleep and pee.',
        link: {},
        name: 'thing'
      }, {
        _id: '57835fbd4f8d95cb1f62c71c',
        description: 'move these sliders to focus on a certain part of the street.',
        header: 'To compare homes on similar incomes,',
        link: {},
        name: 'income'
      }, {
        _id: '57835fbd4f8d95cb1f62c71b',
        description: 'Select countries and regions to compare homes in the same part of the world.',
        header: 'People in the same place can have very different incomes.',
        link: {},
        name: 'geography'
      }, {
        _id: '57835fbd4f8d95cb1f62c71d',
        description: 'Your house number shows your income per month. Most people live somewhere between the richest and the poorest.',
        header: 'Everyone lives on Dollar Street.',
        link: {},
        name: 'street'
      }, {
        _id: '57835fbd4f8d95cb1f62c71e',
        description: 'Click the photos to learn more about the families and their dreams.',
        header: 'Money\'s not everything!',
        link: {
          href: 'https://creativecommons.org/licenses/by/4.0/',
          text: 'All images are free to use under Creative Common License CC BY 4.0'
        },
        name: 'image'
      }];

      context.getCoordinates = (selector: string): any => {
        return coordinates;
      };
    });
  })));

  it('ngOnInit ngOnDestroy', ()=> {
    context.ngOnInit();

    spyOn(context.resizeSubscribe, 'unsubscribe');
    spyOn(context.keyUpSubscribe, 'unsubscribe');

    context.ngOnDestroy();

    expect(context.resizeSubscribe.unsubscribe).toHaveBeenCalled();
    expect(context.keyUpSubscribe.unsubscribe).toHaveBeenCalled();
  });

  it('back', ()=> {
    spyOn(context, 'back').and.callThrough();

    context.step = 1;
    context.back();
    expect(context.step).toEqual(1);

    context.step = 2;
    context.back();
    expect(context.step).toEqual(1);

    context.step = 3;
    context.back();
    expect(context.step).toEqual(2);

    context.step = 4;
    context.back();
    expect(context.step).toEqual(3);

    context.step = 5;
    context.back();
    expect(context.step).toEqual(4);

    context.step = 6;
    context.back();
    expect(context.step).toEqual(5);
  });

  it('next', ()=> {
    spyOn(context, 'next').and.callThrough();

    context.step = 1;
    context.next();
    expect(context.step).toEqual(2);

    context.step = 2;
    context.next();
    expect(context.step).toEqual(3);

    context.step = 3;
    context.next();
    expect(context.step).toEqual(4);

    context.step = 4;
    context.next();
    expect(context.step).toEqual(5);

    context.step = 5;
    context.next();
    expect(context.step).toEqual(5);
  });

  it('getBubble', ()=> {
    spyOn(context, 'getBubble').and.callThrough();

    context.getBubble(6);
    expect(context.getBubble).toHaveBeenCalledWith(6);
    expect(context.position).toEqual({ left: -28, top: -1000 });
  });

  it('setBubblePositionMobile', ()=> {
    spyOn(context, 'setBubblePositionMobile').and.callThrough();

    context.setBubblePositionMobile(1, coordinates, 100, 100);
    expect(context.setBubblePositionMobile).toHaveBeenCalledWith(1, coordinates, 100, 100);

    context.setBubblePositionMobile(2, coordinates, 100, 100);
    expect(context.setBubblePositionMobile).toHaveBeenCalledWith(2, coordinates, 100, 100);

    context.setBubblePositionMobile(3, coordinates, 100, 100);
    expect(context.setBubblePositionMobile).toHaveBeenCalledWith(3, coordinates, 100, 100);

    context.setBubblePositionMobile(4, coordinates, 100, 100);
    expect(context.setBubblePositionMobile).toHaveBeenCalledWith(4, coordinates, 100, 100);

    context.setBubblePositionMobile(6, coordinates, 100, 100);
    expect(context.setBubblePositionMobile).toHaveBeenCalledWith(6, coordinates, 100, 100);
    expect(context.isCloseBubble).toEqual(true);
  });

  it('setBubblePositionDesktop', ()=> {
    spyOn(context, 'setBubblePositionDesktop').and.callThrough();

    context.setBubblePositionDesktop(1, coordinates, 100, 100);
    expect(context.setBubblePositionDesktop).toHaveBeenCalledWith(1, coordinates, 100, 100);

    context.setBubblePositionDesktop(2, coordinates, 100, 100);
    expect(context.setBubblePositionDesktop).toHaveBeenCalledWith(2, coordinates, 100, 100);

    context.setBubblePositionDesktop(3, coordinates, 100, 100);
    expect(context.setBubblePositionDesktop).toHaveBeenCalledWith(3, coordinates, 100, 100);

    context.setBubblePositionDesktop(4, coordinates, 100, 100);
    expect(context.setBubblePositionDesktop).toHaveBeenCalledWith(4, coordinates, 100, 100);

    context.setBubblePositionDesktop(5, coordinates, 100, 100);
    expect(context.setBubblePositionDesktop).toHaveBeenCalledWith(5, coordinates, 100, 100);

    context.setBubblePositionDesktop(6, coordinates, 100, 100);
    expect(context.setBubblePositionDesktop).toHaveBeenCalledWith(6, coordinates, 100, 100);
    expect(context.isCloseBubble).toEqual(true);
  });
});
