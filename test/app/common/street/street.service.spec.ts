import {
  it,
  describe,
  expect,
  beforeEach,
  beforeEachProviders,
  inject,
} from 'angular2/testing';

import {StreetDrawService} from '../../../../app/common/street/street.service';

describe('StreetDrawService', () => {
  let streetDrawService:StreetDrawService;
  let d3Svg:any;
  let axis:any;
  beforeEachProviders(() => [StreetDrawService]);
  beforeEach(inject([StreetDrawService], (sds:StreetDrawService) => {
      streetDrawService = sds;
      d3Svg = {
        selectAll: (selector:string):typeof d3Svg => {
          return d3Svg;
        },
        remove: (selector:string):typeof d3Svg => {
          return d3Svg;
        },
        data: (data:any):typeof d3Svg => {
          return d3Svg;
        },
        enter: (selector:string):typeof d3Svg => {
          return d3Svg;
        },
        append: (selector:string):typeof d3Svg => {
          return d3Svg;
        },
        attr: (attr:string, attrVal:any):typeof d3Svg => {
          return d3Svg;
        },
        style: (style:string, styleVal:any):typeof d3Svg => {
          return d3Svg;
        },
        text: (text:string):typeof d3Svg => {
          return d3Svg;
        },
        domain: (domains:number[]):typeof d3Svg => {
          return d3Svg;
        },
        range: (range:number[]):typeof d3Svg => {
          return d3Svg;
        }
      };
      axis = {
        orient: (selector:string):typeof d3Svg => {
          return d3Svg;
        },
        scale: (selector:string):typeof d3Svg => {
          return d3Svg;
        },
        tickFormat: (selector:string):typeof d3Svg => {
          return d3Svg;
        },
        tickSize: (selector:string):typeof d3Svg => {
          return d3Svg;
        },
      };
    })
  )
  ;

  it('init', () => {
    spyOn(d3.scale, 'log').and.returnValue(d3Svg);
    spyOn(d3Svg, 'domain').and.callThrough();
    spyOn(d3Svg, 'range').and.callThrough();
    let svg = {
      style: (b:string):number => {
        if (b === 'width') {
          return 1000;
        }
        return 100;
      }
    };
    spyOn(d3, 'select').and.returnValue(svg);
    streetDrawService.setSvg = document.createElement('svg');
    streetDrawService.init();
    expect(d3Svg.domain).toHaveBeenCalledWith([1, 10, 100, 10000]);
    expect(d3Svg.range).toHaveBeenCalledWith([0.07 * streetDrawService.width, 0.375 * streetDrawService.width,
      0.75 * streetDrawService.width, 0.97 * streetDrawService.width]);
  });

  it('setSvg', () => {
    spyOn(d3, 'select');
    let element = document.createElement('svg');
    streetDrawService.setSvg = element;
    expect(d3.select).toHaveBeenCalledWith(element);
  });
  it('set', () => {
    streetDrawService.set('testKey', 'testValue');
    expect(streetDrawService['testKey']).toEqual('testValue');
  });
  it('clearAndRedraw', () => {
    spyOn(streetDrawService, 'removeHouses');
    spyOn(streetDrawService, 'drawHouses');
    spyOn(streetDrawService, 'drawHoverHouse');
    streetDrawService.clearAndRedraw([{_id: 'testId1'}, {_id: 'testId2'}]);
    expect(streetDrawService.removeHouses).toHaveBeenCalledWith('hover');
    expect(streetDrawService.removeHouses).toHaveBeenCalledWith('chosen');
    expect(streetDrawService.drawHouses).toHaveBeenCalledWith([{_id: 'testId1'}, {_id: 'testId2'}]);
    streetDrawService.clearAndRedraw([{_id: 'testId1'}, {_id: 'testId2'}], true);
    expect(streetDrawService.removeHouses).toHaveBeenCalledWith('hover');
    expect(streetDrawService.removeHouses).toHaveBeenCalledWith('chosen');
    /**work with this*/
    expect(streetDrawService.drawHoverHouse).toHaveBeenCalledWith({_id: 'testId1'});
  });
  it('clearSvg', () => {
    spyOn(d3, 'select').and.returnValue(d3Svg);
    spyOn(d3Svg, 'selectAll').and.callThrough();
    spyOn(d3Svg, 'remove').and.callThrough();
    streetDrawService.setSvg = document.createElement('svg');
    streetDrawService.clearSvg();
    expect(d3Svg.selectAll).toHaveBeenCalledWith('*');
    expect(d3Svg.remove).toHaveBeenCalledWith('*');
    expect(streetDrawService.clearSvg()).toBeAnInstanceOf(StreetDrawService);
  });
  it('removeHouses', () => {
    spyOn(d3, 'select').and.returnValue(d3Svg);
    spyOn(d3Svg, 'selectAll').and.callThrough();
    spyOn(d3Svg, 'remove').and.callThrough();
    streetDrawService.setSvg = document.createElement('svg');
    expect(streetDrawService.removeHouses('chosen')).toBeAnInstanceOf(StreetDrawService);
    streetDrawService.removeHouses('chosen');
    expect(d3Svg.selectAll).toHaveBeenCalledWith('rect.chosen');
    expect(d3Svg.remove).toHaveBeenCalledWith('rect.chosen');
    expect(d3Svg.selectAll).toHaveBeenCalledWith('polygon.chosen');
    expect(d3Svg.remove).toHaveBeenCalledWith('polygon.chosen');
    expect(d3Svg.selectAll).toHaveBeenCalledWith('polygon.chosenLine');
    expect(d3Svg.remove).toHaveBeenCalledWith('polygon.chosenLine');
  });
  it('drawHoverHouse', () => {
    spyOn(d3, 'select').and.returnValue(d3Svg);
    spyOn(d3Svg, 'selectAll').and.callThrough();
    spyOn(d3Svg, 'remove').and.callThrough();
    spyOn(d3Svg, 'data').and.callThrough();
    spyOn(d3Svg, 'enter').and.callThrough();
    spyOn(d3Svg, 'append').and.callThrough();
    spyOn(d3Svg, 'attr').and.callThrough();
    spyOn(d3Svg, 'style').and.callThrough();
    streetDrawService.setSvg = document.createElement('svg');
    streetDrawService.drawHoverHouse({income: 10});
    expect(d3Svg.selectAll).toHaveBeenCalledWith('polygon.hover');
    expect(d3Svg.data).toHaveBeenCalledWith([{income: 10}]);
    expect(d3Svg.enter).toHaveBeenCalled();
    expect(d3Svg.attr).toHaveBeenCalledWith('class', 'hover');
    /**add attr('points', (datum) => {}) test*/
    expect(d3Svg.attr).toHaveBeenCalledWith('stroke-width', 1);
    /**add   .attr('stroke', (datum) => {}) test*/
  });
  it('drawHouses', () => {
    spyOn(d3, 'select').and.returnValue(d3Svg);
    spyOn(d3Svg, 'selectAll').and.callThrough();
    spyOn(d3Svg, 'remove').and.callThrough();
    spyOn(d3Svg, 'data').and.callThrough();
    spyOn(d3Svg, 'enter').and.callThrough();
    spyOn(d3Svg, 'append').and.callThrough();
    spyOn(d3Svg, 'attr').and.callThrough();
    spyOn(d3Svg, 'style').and.callThrough();
    streetDrawService.setSvg = document.createElement('svg');
    streetDrawService.drawHouses([{income: 10}, {income: 100}]);
    expect(d3Svg.selectAll).toHaveBeenCalledWith('polygon.chosen');
    expect(d3Svg.data).toHaveBeenCalledWith([{income: 10}, {income: 100}]);
    expect(d3Svg.enter).toHaveBeenCalled();
    expect(d3Svg.attr).toHaveBeenCalledWith('class', 'chosen');
    /**add attr('points', (datum) => {}) test*/
    expect(d3Svg.attr).toHaveBeenCalledWith('stroke', '#303e4a');
    expect(d3Svg.style).toHaveBeenCalledWith('fill', '#374551');
  });

  it('drawScale', () => {
    spyOn(d3, 'select').and.returnValue(d3Svg);
    spyOn(d3.svg, 'axis').and.returnValue(axis);
    spyOn(axis, 'scale').and.returnValue(axis);
    spyOn(axis, 'orient').and.returnValue(axis);
    spyOn(axis, 'tickFormat').and.returnValue(axis);
    spyOn(axis, 'tickSize').and.returnValue(axis);

    spyOn(d3Svg, 'selectAll').and.callThrough();
    spyOn(d3Svg, 'remove').and.callThrough();
    spyOn(d3Svg, 'data').and.callThrough();
    spyOn(d3Svg, 'enter').and.callThrough();
    spyOn(d3Svg, 'text').and.callThrough();
    spyOn(d3Svg, 'append').and.callThrough();
    spyOn(d3Svg, 'attr').and.callThrough();
    spyOn(d3Svg, 'style').and.callThrough();

    /** make this.height and this.width private*/
    streetDrawService.height = 50;
    streetDrawService.width = 50;
    streetDrawService.halfOfHeight = streetDrawService.height / 2;
    streetDrawService.setSvg = document.createElement('svg');
    streetDrawService.drawScale([{income: 10}, {income: 100}]);


    expect(d3.svg.axis).toHaveBeenCalled();
    expect(axis.scale).toHaveBeenCalled();
    expect(axis.orient).toHaveBeenCalledWith('bottom');
    expect(axis.tickFormat).toHaveBeenCalled();
    expect(axis.tickSize).toHaveBeenCalledWith(6, 0);


    expect(d3Svg.selectAll).toHaveBeenCalledWith('text.poorest');
    expect(d3Svg.data).toHaveBeenCalledWith(['Poorest 1$']);
    expect(d3Svg.enter).toHaveBeenCalled();
    expect(d3Svg.append).toHaveBeenCalledWith('text');
    expect(d3Svg.attr).toHaveBeenCalledWith('class', 'poorest');
    expect(d3Svg.text).toHaveBeenCalledWith('Poorest 1$');
    expect(d3Svg.attr).toHaveBeenCalledWith('x', 0);
    expect(d3Svg.attr).toHaveBeenCalledWith('y', 45);
    expect(d3Svg.attr).toHaveBeenCalledWith('fill', '#767d86');

    /** isDesktop true need for test  */

    expect(d3Svg.selectAll).toHaveBeenCalledWith('text.richest');
    expect(d3Svg.data).toHaveBeenCalledWith(['Richest']);
    expect(d3Svg.enter).toHaveBeenCalled();
    expect(d3Svg.append).toHaveBeenCalledWith('text');
    expect(d3Svg.attr).toHaveBeenCalledWith('class', 'richest');
    expect(d3Svg.text).toHaveBeenCalledWith('Richest');
    expect(d3Svg.attr).toHaveBeenCalledWith('x', 10);
    expect(d3Svg.attr).toHaveBeenCalledWith('y', 45);
    expect(d3Svg.attr).toHaveBeenCalledWith('fill', '#767d86');


    expect(d3Svg.append).toHaveBeenCalledWith('polygon');
    expect(d3Svg.attr).toHaveBeenCalledWith('class', 'road');
    /**add attr('points', (datum) => {}) test*/
    expect(d3Svg.style).toHaveBeenCalledWith('fill', '#737b83');

    expect(d3Svg.append).toHaveBeenCalledWith('line');
    expect(d3Svg.attr).toHaveBeenCalledWith('class', 'axis');
    expect(d3Svg.attr).toHaveBeenCalledWith('x1', 0);
    expect(d3Svg.attr).toHaveBeenCalledWith('y1', streetDrawService.halfOfHeight + 10);
    expect(d3Svg.attr).toHaveBeenCalledWith('x2', streetDrawService.width);
    expect(d3Svg.attr).toHaveBeenCalledWith('y2', streetDrawService.halfOfHeight + 10);
    expect(d3Svg.attr).toHaveBeenCalledWith('stroke-width', 2);
    expect(d3Svg.attr).toHaveBeenCalledWith('stroke', '#505b65');

    expect(d3Svg.append).toHaveBeenCalledWith('line');
    expect(d3Svg.attr).toHaveBeenCalledWith('class', 'dash');
    expect(d3Svg.attr).toHaveBeenCalledWith('x1', 18);
    expect(d3Svg.attr).toHaveBeenCalledWith('y1', streetDrawService.halfOfHeight + 3);
    expect(d3Svg.attr).toHaveBeenCalledWith('x2', streetDrawService.width - 9);
    expect(d3Svg.attr).toHaveBeenCalledWith('y2', streetDrawService.halfOfHeight + 3);
    expect(d3Svg.attr).toHaveBeenCalledWith('stroke-dasharray', '8,8');
    expect(d3Svg.attr).toHaveBeenCalledWith('stroke-width', 1.5);
    expect(d3Svg.attr).toHaveBeenCalledWith('stroke', 'white');

    expect(d3Svg.selectAll).toHaveBeenCalledWith('text.scale-label');
    expect(d3Svg.data).toHaveBeenCalledWith([10, 100]);
    expect(d3Svg.enter).toHaveBeenCalled();
    expect(d3Svg.append).toHaveBeenCalledWith('text');
    expect(d3Svg.attr).toHaveBeenCalledWith('class', 'scale-label');
    expect(d3Svg.text).toHaveBeenCalled();
    /** call with function*/
    expect(d3Svg.attr).toHaveBeenCalled();
    expect(d3Svg.attr).toHaveBeenCalledWith('y', streetDrawService.height - 5);
    expect(d3Svg.attr).toHaveBeenCalledWith('fill', '#767d86');
  });
});
