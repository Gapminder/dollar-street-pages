const d3 = require('d3');
const _ = require('lodash');
const device = require('device.js')();
const isDesktop = device.desktop();
import {fromEvent} from 'rxjs/observable/fromEvent';
import {Subject} from 'rxjs/Subject';

export class StreetDrawService {
  public width:number;
  public height:number;
  public halfOfHeight:number;
  public lowIncome:number = 0;
  public hightIncome:number = 15000;
  private places:any[] = [];
  private poorest:string = 'Poorest';
  private richest:string = 'Richest';
  private scale:any;
  private axisLabel:number[] = [30, 300, 3000];
  private svg:any;
  private incomeArr:any[] = [];
  private fullIncomeArr:any[] = [];

  private mouseMoveSubscriber:any;
  private mouseUpSubscriber:any;
  private touchMoveSubscriber:any;
  private touchUpSubscriber:any;
  private sliderRightBorder:number;
  private sliderLeftBorder:number;
  private sliderRightMove:boolean = false;
  private sliderLeftMove:boolean = false;
  private leftScroll:any;
  private rightScroll:any;
  private leftScrollOpacity:any;
  private rightScrollOpacity:any;
  private leftScrollText:any;
  private rightScrollText:any;

  private filter:Subject<any> = new Subject();

  public init():this {
    this.width = parseInt(this.svg.style('width'), 10);
    this.height = parseInt(this.svg.style('height'), 10);
    this.halfOfHeight = 0.5 * this.height;

    this.scale = d3
      .scale.log()
      .domain([1, 30, 300, 3000, 15000])
      .range([0, 0.07 * this.width, 0.375 * this.width, 0.75 * this.width, 0.99 * this.width]);

    return this;
  }

  public set setSvg(element:HTMLElement) {
    this.svg = d3.select(element);
  }

  public set(key:any, val:any):this {
    this[key] = val;
    return this;
  };

  public onSvgHover(positionX:any, cb:any):void {
    if (this.sliderLeftBorder > positionX || this.sliderRightBorder < positionX) {
      return cb(void 0);
    }
    this.hoverOnScalePoint(this.whatIsIncome(Math.round(positionX - 15)), cb);
  };

  protected whatIsIncome(positionX:any):any {
    let index = _.sortedIndex(this.fullIncomeArr, positionX);
    let indexL = index - 1;

    if (indexL <= 0) {
      return _.first(this.places);
    }

    if (index >= this.fullIncomeArr.length) {
      return _.chain(this.places)
        .compact()
        .last()
        .value();
    }
    let right = this.scale(this.places[index].income) - positionX;
    let left = this.scale(this.places[indexL].income) - positionX;

    if (Math.abs(right) > Math.abs(left)) {
      return this.places[indexL];
    }

    return this.places[index];
  };

  public drawScale(places:any):this {
    if (!places || !places.length) {
      return this;
    }
    d3.svg
      .axis()
      .scale(this.scale)
      .orient('bottom')
      .tickFormat(() => {
        return void 0;
      })
      .tickSize(6, 0);

    this.svg
      .selectAll('text.poorest')
      .data([this.poorest])
      .enter()
      .append('text')
      .attr('class', 'poorest')
      .text(this.poorest)
      .attr('x', 0)
      .attr('y', this.height - 5)
      .attr('fill', '#767d86');

    this.svg
      .selectAll('text.richest')
      .data([this.richest])
      .enter()
      .append('text')
      .attr('class', 'richest')
      .text(this.richest)
      .attr('x', this.width - 40)
      .attr('y', this.height - 5)
      .attr('fill', '#767d86');

    if (isDesktop) {
      this.svg
        .selectAll('rect.point')
        .data(places)
        .enter()
        .append('rect')
        .attr('class', 'point')
        .attr('x', (d:any):any => {
          if (!d) {
            return 0;
          }
          return this.scale(d.income) - 4;
        })
        .attr('y', this.halfOfHeight - 11)
        .attr('width', (d:any):any => {
          if (!d) {
            return 0;
          }
          return 8;
        })
        .attr('height', (d:any):any => {
          if (!d) {
            return 0;
          }
          return 7;
        })
        .style('fill', '#cfd2d6')
        .style('opacity', '0.7');
    }

    this.svg
      .append('polygon')
      .attr('class', 'road')
      .attr('points', () => {
        let point1 = `0,${ this.halfOfHeight + 9}`;
        let point2 = `15,${ this.halfOfHeight - 4}`;
        let point3 = `${ this.width - 15},${ this.halfOfHeight - 4}`;
        let point4 = `${ this.width},${ this.halfOfHeight + 9}`;
        return `${point1} ${point2} ${point3} ${point4}`;
      })
      .style('fill', '#737b83');

    this.svg
      .append('line')
      .attr('class', 'axis')
      .attr('x1', 0)
      .attr('y1', this.halfOfHeight + 10)
      .attr('x2', this.width)
      .attr('y2', this.halfOfHeight + 10)
      .attr('stroke-width', 2)
      .attr('stroke', '#505b65');

    this.svg
      .append('line')
      .attr('class', 'dash')
      .attr('x1', 18)
      .attr('y1', this.halfOfHeight + 3)
      .attr('x2', this.width - 9)
      .attr('y2', this.halfOfHeight + 3)
      .attr('stroke-dasharray', '8,8')
      .attr('stroke-width', 1.5)
      .attr('stroke', 'white');

    this.incomeArr.length = 0;

    this.svg
      .selectAll('text.scale-label')
      .data(this.axisLabel)
      .enter()
      .append('text')
      .attr('class', 'scale-label')
      .text((d:any) => {
        return d + '$';
      })
      .attr('x', (d:any) => {
        let indent = 0;

        if ((d + '').length === 2) {
          indent = 11;
        }

        if ((d + '').length === 3) {
          indent = 15;
        }

        return this.scale(d) - indent;
      })
      .attr('y', this.height - 5)
      .attr('fill', '#767d86');

    this.drawLeftSlider(this.lowIncome ? this.scale(this.lowIncome) : (25), true);
    this.drawRightSlider(this.hightIncome ? this.scale(this.hightIncome) - 15 : (this.width - 25), true);

    if (this.mouseMoveSubscriber) {
      this.mouseMoveSubscriber.unsubscribe();
    }
    this.mouseMoveSubscriber = fromEvent(window, 'mousemove').filter((e:MouseEvent)=> {
      e.preventDefault();
      e.stopPropagation();
      return this.sliderLeftMove || this.sliderRightMove;
    }).subscribe((e:MouseEvent)=> {
      if (this.sliderLeftMove && e.pageX <= this.sliderRightBorder && e.pageX >= 30) {
        return this.drawLeftSlider(e.pageX - 10);
      }
      if (this.sliderRightMove && e.pageX >= this.sliderLeftBorder && e.pageX <= this.width) {
        return this.drawRightSlider(e.pageX - 20);
      }
    });

    if (this.touchMoveSubscriber) {
      this.touchMoveSubscriber.unsubscribe();
    }
    this.touchMoveSubscriber = fromEvent(window, 'touchmove').filter((e:TouchEvent)=> {
      return this.sliderLeftMove || this.sliderRightMove;
    }).subscribe((e:TouchEvent)=> {
      let positionX = e.touches[0].pageX;

      if (this.sliderLeftMove && positionX <= this.sliderRightBorder && positionX >= 30) {
        return this.drawLeftSlider(positionX - 10);
      }
      if (this.sliderRightMove && positionX >= this.sliderLeftBorder && positionX <= this.width) {
        return this.drawRightSlider(positionX - 20);
      }
    });

    this.mouseUpSubscriber = fromEvent(window, 'mouseup').filter((e?:MouseEvent)=> {
      return this.sliderLeftMove || this.sliderRightMove;
    }).subscribe((e?:MouseEvent)=> {
      this.sliderLeftMove = this.sliderRightMove = false;
      this.filter.next({lowIncome: Math.round(this.lowIncome), hightIncome: Math.round(this.hightIncome)});
    });

    this.touchUpSubscriber = fromEvent(window, 'touchend').filter((e?:TouchEvent)=> {
      return this.sliderLeftMove || this.sliderRightMove;
    }).subscribe((e?:TouchEvent)=> {
      this.sliderLeftMove = this.sliderRightMove = false;
      this.filter.next({lowIncome: Math.round(this.lowIncome), hightIncome: Math.round(this.hightIncome)});
    });
    return this;
  };

  protected drawLeftSlider(x:number, init = false):this {
    this.sliderLeftBorder = x + 20;
    if (!this.leftScroll) {
      this.leftScroll = this.svg
        .append('polygon')
        .attr('class', 'left-scroll')
        .style('fill', '#515c65')
        .style('cursor', 'pointer')
        .attr('stroke-width', 1)
        .attr('stroke', '#48545f')
        .on('mousedown', (e?:MouseEvent):void=> this.sliderLeftMove = true)
        .on('touchstart', (e?:TouchEvent):void=> this.sliderLeftMove = true);
    }

    this.leftScroll
      .attr('points', () => {
        let point1 = `${x - 9},${ this.halfOfHeight + 10}`;
        let point2 = `${x - 9},${ this.halfOfHeight - 5}`;
        let point3 = `${x},${ this.halfOfHeight - 5}`;
        let point4 = `${x},${ this.halfOfHeight + 10}`;
        let point5 = `${x - 4.5},${ this.halfOfHeight + 10 + 5}`;
        return `${point1} ${point2} ${point3} ${point4} ${point5}`;
      });
    if (!this.leftScrollOpacity) {
      this.leftScrollOpacity = this.svg
        .append('rect')
        .attr('class', 'left-scroll-opacity-part')
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', 60)
        .style('fill', 'white')
        .style('opacity', '0.8');
    }
    this.leftScrollOpacity
      .attr('width', x - 10)

    this.lowIncome = this.scale.invert(x);
    if (init) {
      return this;
    }

    this.drawScrollLabel(x, 'left-scroll-label');
    return this;
  };


  protected drawRightSlider(x:number, init = false):this {
    this.sliderRightBorder = x;

    if (!this.rightScroll) {
      this.rightScroll = this.svg
        .append('polygon')
        .attr('class', 'right-scroll')
        .style('fill', '#515c65')
        .style('cursor', 'pointer')
        .attr('stroke-width', 1)
        .attr('stroke', '#48545f')
        .on('mousedown', ():void=> this.sliderRightMove = true)
        .on('touchstart', ():void=> this.sliderRightMove = true);
    }
    this.rightScroll.attr('points', () => {
      let point1 = `${x},${ this.halfOfHeight + 10}`;
      let point2 = `${x},${ this.halfOfHeight - 5}`;
      let point3 = `${x + 9},${ this.halfOfHeight - 5}`;
      let point4 = `${x + 9},${ this.halfOfHeight + 10}`;
      let point5 = `${x + 4.5},${ this.halfOfHeight + 10 + 5}`;
      return `${point1} ${point2} ${point3} ${point4} ${point5}`;
    });

    if (!this.rightScrollOpacity) {
      this.rightScrollOpacity = this.svg
        .append('rect')
        .attr('class', 'right-scroll-opacity-part')
        .attr('y', 0)
        .attr('height', 60)
        .style('fill', 'white')
        .style('opacity', '0.8');
    }
    this.rightScrollOpacity
      .attr('x', x + 9)
      .attr('width', this.width - x - 1);
    this.hightIncome = this.scale.invert(x);
    if (init) {
      return this;
    }

    this.drawScrollLabel(x, 'right-scroll-label');

    return this;
  };

  private drawScrollLabel(x:number, selector:string):this {
    this.svg.selectAll('text.poorest').remove('text.poorest');
    this.svg.selectAll('text.richest').remove('text.richest');
    this.svg.selectAll('text.scale-label').remove('text.scale-label');
    let incomeL = Math.ceil(this.lowIncome ? this.lowIncome : 0);
    let incomeR = Math.ceil(this.hightIncome ? this.hightIncome : 15000);
    let xL = this.scale(incomeL);
    let xR = this.scale(incomeR);
    if (!this.leftScrollText) {
      this.leftScrollText = this.svg
        .append('text')
        .attr('class', 'left-scroll-label')
        .text(`${incomeL}$`)
        .attr('y', this.height - 5)
        .attr('fill', '#767d86');
    }
    if (!this.rightScrollText) {
      this.rightScrollText = this.svg
        .append('text')
        .attr('class', 'right-scroll-label')
        .text(`${incomeR}$`)
        .attr('y', this.height - 5)
        .attr('fill', '#767d86');
    }
    this.rightScrollText
      .text(`${incomeR}$`)
      .attr('x', ()=> xR - parseInt(this.rightScrollText.style('width'),10) / 2);
    this.leftScrollText
      .text(`${incomeL}$`)
      .attr('x', ()=> xL - parseInt(this.leftScrollText.style('width'),10) / 2);
    return this;
  };

  private hoverOnScalePoint(d:any, cb:any):void {
    if (!d) {
      return;
    }
    this
      .set('hoverPlace', void 0)
      .removeHouses('chosen')
      .removeHouses('hover');

    let places = _.filter(this.places, (place:any) => {
      if (!place) {
        return false;
      }
      return place.income === d.income;
    });
    if (places.length === 1) {
      this.set('hoverPlace', places[0])
        .drawHoverHouse(places[0]);
    } else {
      this.set('hoverPlace', places[0])
        .drawHoverHouse(places[0], true);
    }

    let options = {
      places: places,
      left: this.scale(d.income)
    };
    cb(options);
  };

  public drawHouses(places:any):this {
    if (!places || !places.length) {
      return this;
    }
    let halfHouseWidth = 10;
    let roofX = 2 - halfHouseWidth;
    let roofY = this.halfOfHeight - 12;

    this.svg.selectAll('polygon.chosen')
      .data(places)
      .enter()
      .append('polygon')
      .attr('class', 'chosen')
      .attr('points', (datum:any):any => {
        let point1, point2, point3, point4, point5, point6, point7;

        if (datum) {
          let scaleDatumIncome = this.scale(datum.income);
          point1 = `${ scaleDatumIncome + roofX},${this.halfOfHeight - 1}`;
          point2 = `${scaleDatumIncome + roofX},${roofY}`;
          point3 = `${scaleDatumIncome - halfHouseWidth },${roofY}`;
          point4 = `${scaleDatumIncome },${ this.halfOfHeight - 21}`;
          point5 = `${scaleDatumIncome + halfHouseWidth },${roofY}`;
          point6 = `${scaleDatumIncome - roofX },${ roofY}`;
          point7 = `${scaleDatumIncome - roofX },${ this.halfOfHeight - 1}`;
        }

        return !datum ? void 0 : point1 + ' ' + point2 + ' ' +
        point3 + ' ' + point4 + ' ' + point5 + ' ' + point6 + ' ' + point7;
      })
      .attr('stroke', '#303e4a')
      .style('fill', '#374551');

    return this;
  };

  public drawHoverHouse(place:any, gray:boolean = false):this {
    if (!place) {
      return this;
    }
    let colors = this.getFills();
    let fills = colors.fills;
    let fillsOfBorders = colors.fillsOfBorders;
    let halfHouseWidth = 12.5;
    let roofX = 2 - halfHouseWidth;
    let roofY = this.halfOfHeight - 15;
    this.svg.selectAll('polygon.hover')
      .data([place])
      .enter()
      .append('polygon')
      .attr('class', 'hover')
      .attr('points', (datum:any):any => {
        let point1, point2, point3, point4, point5, point6, point7;

        if (datum) {
          let scaleDatumIncome = this.scale(datum.income);
          point1 = `${scaleDatumIncome + roofX },${ this.halfOfHeight - 1}`;
          point2 = `${scaleDatumIncome + roofX},${roofY}`;
          point3 = `${scaleDatumIncome - halfHouseWidth },${roofY}`;
          point4 = `${scaleDatumIncome },${this.halfOfHeight - 26}`;
          point5 = `${scaleDatumIncome + halfHouseWidth },${roofY}`;
          point6 = `${scaleDatumIncome - roofX },${roofY}`;
          point7 = `${scaleDatumIncome - roofX },${this.halfOfHeight - 1}`;
        }

        return !datum ? void 0 : point1 + ' ' + point2 + ' ' +
        point3 + ' ' + point4 + ' ' + point5 + ' ' + point6 + ' ' + point7;
      })
      .attr('stroke-width', 1)
      .attr('stroke', (datum:any):any => {
        if (gray) {
          return '#303e4a';
        }

        return !datum ? void 0 : fillsOfBorders[datum.region];
      })
      .style('fill', (datum:any):any => {
        if (gray) {
          return '#374551';
        }

        return !datum ? void 0 : fills[datum.region];
      });

    return this;
  };

  protected getFills():any {
    return {
      fills: {
        Europe: '#FFE800',
        Africa: '#15B0D1',
        America: '#B1E826',
        Asia: '#F23373'
      },
      fillsOfBorders: {
        Europe: '#dbc700',
        Africa: '#119ab7',
        America: '#96c61d',
        Asia: '#bc1950'
      }
    };
  };

  public clearAndRedraw(places:any, slider:boolean = false):this {
    if (!places || !places.length && !slider) {
      return this;
    }
    this.removeHouses('hover');
    this.removeHouses('chosen');
    if (slider) {
      this.drawHoverHouse(places);
      return;
    }

    this.drawHouses(places);
    return this;
  };

  public removeHouses(selector:any):this {
    this.svg.selectAll('rect.' + selector).remove('rect.' + selector);
    this.svg.selectAll('polygon.' + selector).remove('polygon.' + selector);

    if (selector === 'chosen') {
      this.svg.selectAll('polygon.chosenLine').remove('polygon.chosenLine');
    }

    return this;
  };

  public clearSvg():this {
    this.leftScroll = void 0;
    this.rightScroll = void 0;
    this.leftScrollOpacity = void 0;
    this.rightScrollOpacity = void 0;
    this.leftScrollText = void 0;
    this.rightScrollText = void 0;
    this.hightIncome = 15000;
    this.lowIncome = 0;

    this.svg.selectAll('*').remove('*');
    return this;
  };
}
