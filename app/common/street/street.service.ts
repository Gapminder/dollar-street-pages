const d3 = require('d3');
const device = require('device.js')();
const isDesktop = device.desktop();

import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subject } from 'rxjs/Subject';

export class StreetDrawService {
  public width:number;
  public height:number;
  public halfOfHeight:number;
  public lowIncome:number;
  public highIncome:number;
  private poorest:string = 'Poorest';
  private richest:string = 'Richest';
  private scale:any;
  private axisLabel:number[] = [];
  private svg:any;
  private incomeArr:any[] = [];
  private mouseMoveSubscriber:any;
  private dividersData:any;
  private mouseUpSubscriber:any;
  private touchMoveSubscriber:any;
  private touchUpSubscriber:any;
  private sliderRightBorder:number;
  private sliderLeftBorder:number;
  private sliderRightMove:boolean = false;
  private sliderLeftMove:boolean = false;
  private leftScroll:any;
  private rightScroll:any;
  private leftScrollOpacityStreet:any;
  private leftScrollOpacityLabels:any;
  private rightScrollOpacityStreet:any;
  private rightScrollOpacityLabels:any;
  private leftScrollText:any;
  private rightScrollText:any;
  private hoverPlace:any;
  private colors:{fills:any, fillsOfBorders:any} = {
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

  private filter:Subject<any> = new Subject();

  public init(lowIncome:any, highIncome:any, drawDividers:any):this {
    this.axisLabel = [drawDividers.low, drawDividers.medium, drawDividers.high];
    this.dividersData = drawDividers;
    this.lowIncome = lowIncome || drawDividers.poor;
    this.highIncome = highIncome || drawDividers.rich;
    this.width = parseInt(this.svg.style('width'), 10) - 60;
    this.height = parseInt(this.svg.style('height'), 10);
    this.halfOfHeight = 0.5 * this.height;
    this.scale = d3
      .scale.log()
      .domain([drawDividers.poor, drawDividers.low, drawDividers.medium, drawDividers.high, drawDividers.rich])
      .range([18.8 / 1000 * this.width, drawDividers.lowDividerCoord / 1000 * this.width, drawDividers.mediumDividerCoord / 1000 * this.width, drawDividers.highDividerCoord / 1000 * this.width, 0.9805 * this.width]);

    return this;
  }

  public set setSvg(element:HTMLElement) {
    this.svg = d3.select(element);
  }

  public set(key:any, val:any):this {
    this[key] = val;

    return this;
  };

  public isDrawDividers(drawDividers:any):this {
    if (!drawDividers.showDividers) {
      return;
    }

    this.svg
      .selectAll('text.scale-label')
      .data(this.axisLabel)
      .enter()
      .append('text')
      .text((d:any) => {
        return this.fillSpaces(d) + '$';
      })
      .attr('x', (d:any) => {
        let indent = 0;

        if ((d + '').length === 2) {
          indent = 11;
        }

        if ((d + '').length === 3) {
          indent = 15;
        }
        return this.scale(d) - indent + 25;
      })
      .attr('class', (d:any) => {
        return 'scale-label' + d;
      })
      .attr('y', this.height)
      .attr('fill', '#767d86');

    this.svg
      .selectAll('image.scale-label22222')
      .data(this.axisLabel)
      .enter()
      .append('svg:image')
      .attr('class', 'scale-label22222')
      .attr('xlink:href', '/assets/img/divider1.svg')
      .attr('y', 26)
      .attr('width', 15 + 19)
      .attr('height', 24)
      .attr('x', (d:any) => {
        let indent = 0;
        let center = 11;

        if ((d + '').length === 2) {
          indent = 11;
          center = 2;
        }

        if ((d + '').length === 3) {
          indent = 15;
          center = 7;
        }

        return this.scale(d) - indent + 15 + center;
      });
    return this;
  }

  public drawScale(places:any, isShowSlider:boolean, drawDividers:any):this {
    let halfHouseWidth = 7;
    let roofX = 2 - halfHouseWidth;
    let roofY = this.halfOfHeight - 10;
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
      .attr('y', this.height)
      .attr('fill', '#767d86');

    this.svg
      .selectAll('text.richest')
      .data([this.richest])
      .enter()
      .append('text')
      .attr('class', 'richest')
      .text(this.richest)
      .attr('x', this.width + 60 - 40)
      .attr('y', this.height)
      .attr('fill', '#767d86');

    if (isDesktop) {
      this.svg
        .selectAll('polygon')
        .data(places)
        .enter()
        .append('polygon')
        .attr('class', 'point')
        .attr('points', (datum:any):any => {
          let point1;
          let point2;
          let point3;
          let point4;
          let point5;
          let point6;
          let point7;

          if (datum) {
            let scaleDatumIncome = this.scale(datum.income);
            point1 = `${30 + scaleDatumIncome + roofX },${this.halfOfHeight - 4}`;
            point2 = `${30 + scaleDatumIncome + roofX},${roofY}`;
            point3 = `${30 + scaleDatumIncome - halfHouseWidth},${roofY}`;
            point4 = `${30 + scaleDatumIncome},${this.halfOfHeight - 17}`;
            point5 = `${30 + scaleDatumIncome + halfHouseWidth },${roofY}`;
            point6 = `${30 + scaleDatumIncome - roofX },${roofY}`;
            point7 = `${30 + scaleDatumIncome - roofX },${this.halfOfHeight - 4}`;
          }

          return !datum ? void 0 : point1 + ' ' + point2 + ' ' +
          point3 + ' ' + point4 + ' ' + point5 + ' ' + point6 + ' ' + point7;
        })
        .attr('stroke-width', 1)
        .style('fill', '#cfd2d6')
        .style('opacity', '0.7');
    }

    this.svg
      .append('polygon')
      .attr('class', 'road')
      .attr('height', '14px')
      .attr('points', () => {
        let point1 = `0,${ this.halfOfHeight + 11}`;
        let point2 = `30,${ this.halfOfHeight - 4}`;
        let point3 = `${ this.width + 60 - 30},${ this.halfOfHeight - 4}`;
        let point4 = `${ this.width + 60},${ this.halfOfHeight + 11}`;
        return `${point1} ${point2} ${point3} ${point4}`;
      })
      .style('fill', '#727a82');

    this.svg
      .append('line')
      .attr('class', 'whiteline')
      .attr('height', '1px')
      .attr('x1', 0)
      .attr('y1', this.halfOfHeight + 11)
      .attr('x2', this.width + 60)
      .attr('y2', this.halfOfHeight + 11)
      .attr('stroke-width', 2)
      .attr('stroke', '#dde2e5');

    this.svg
      .append('line')
      .attr('class', 'axis')
      .attr('height', '3px')
      .attr('x1', 0)
      .attr('y1', this.halfOfHeight + 13)
      .attr('x2', this.width + 60)
      .attr('y2', this.halfOfHeight + 13)
      .attr('stroke-width', 3)
      .attr('stroke', '#525c64');

    this.svg
      .append('line')
      .attr('class', 'dash')
      .attr('x1', 24)
      .attr('y1', this.halfOfHeight + 4)
      .attr('x2', this.width + 60 - 9)
      .attr('y2', this.halfOfHeight + 3)
      .attr('stroke-dasharray', '17')
      .attr('stroke-width', 2)
      .attr('stroke', 'white');

    this.incomeArr.length = 0;

    this.isDrawDividers(drawDividers);
    if (isShowSlider) {
      this.drawLeftSlider(this.scale(this.lowIncome), true);
      this.drawRightSlider(this.scale(this.highIncome), true);
    }

    if (this.mouseMoveSubscriber) {
      this.mouseMoveSubscriber.unsubscribe();
    }

    this.mouseMoveSubscriber = fromEvent(window, 'mousemove').filter((e:MouseEvent)=> {
      e.preventDefault();

      return this.sliderLeftMove || this.sliderRightMove;
    }).subscribe((e:MouseEvent)=> {
      e.preventDefault();

      if (this.sliderLeftMove && e.pageX <= this.sliderRightBorder && e.pageX >= 40) {
        return this.drawLeftSlider(e.pageX - 40);
      }

      if (this.sliderRightMove && e.pageX >= this.sliderLeftBorder && e.pageX <= this.width + 40) {
        return this.drawRightSlider(e.pageX - 40);
      }
    });

    if (this.touchMoveSubscriber) {
      this.touchMoveSubscriber.unsubscribe();
    }

    this.touchMoveSubscriber = fromEvent(window, 'touchmove')
      .filter(()=> {
        return this.sliderLeftMove || this.sliderRightMove;
      }).subscribe((e:TouchEvent)=> {
        let positionX = e.touches[0].pageX;

        if (this.sliderLeftMove && positionX <= this.sliderRightBorder && positionX >= 40) {
          return this.drawLeftSlider(positionX - 40);
        }

        if (this.sliderRightMove && positionX >= this.sliderLeftBorder && positionX <= this.width + 40) {
          return this.drawRightSlider(positionX - 40);
        }
      });

    this.mouseUpSubscriber = fromEvent(window, 'mouseup')
      .filter(()=> {
        return this.sliderLeftMove || this.sliderRightMove;
      }).subscribe((e?:MouseEvent)=> {
        e.preventDefault();

        this.sliderLeftMove = this.sliderRightMove = false;

        if (this.highIncome > this.dividersData.rich) {
          this.highIncome = this.dividersData.rich + 0.00002;
        }
        this.filter.next({
          lowIncome: Math.round(this.lowIncome),
          highIncome: Math.round(this.highIncome)
        });
      });

    this.touchUpSubscriber = fromEvent(window, 'touchend')
      .filter(()=> {
        return this.sliderLeftMove || this.sliderRightMove;
      }).subscribe(()=> {
        this.sliderLeftMove = this.sliderRightMove = false;

        if (this.highIncome > this.dividersData.rich) {
          this.highIncome = this.dividersData.rich + 0.00002;
        }

        this.filter.next({
          lowIncome: Math.round(this.lowIncome),
          highIncome: Math.round(this.highIncome)
        });
      });

    return this;
  };

  public drawHoverHouse(place:any, gray:boolean = false):this {
    if (!place) {
      return this;
    }

    let fills = this.colors.fills;
    let fillsOfBorders = this.colors.fillsOfBorders;
    let halfHouseWidth = 12.5;
    let roofX = 2 - halfHouseWidth;
    let roofY = this.halfOfHeight - 15 - 1;

    this.svg
      .selectAll('polygon.hover')
      .data([place])
      .enter()
      .append('polygon')
      .attr('class', 'hover')
      .attr('points', (datum:any):any => {
        let point1;
        let point2;
        let point3;
        let point4;
        let point5;
        let point6;
        let point7;

        if (datum) {
          let scaleDatumIncome = this.scale(datum.income);
          point1 = `${scaleDatumIncome + 30 + roofX },${this.halfOfHeight - 1 - 1}`;
          point2 = `${scaleDatumIncome + 30 + roofX},${roofY}`;
          point3 = `${scaleDatumIncome + 30 - halfHouseWidth},${roofY}`;
          point4 = `${scaleDatumIncome + 30 },${this.halfOfHeight - 26 - 1}`;
          point5 = `${scaleDatumIncome + 30 + halfHouseWidth },${roofY}`;
          point6 = `${scaleDatumIncome + 30 - roofX },${roofY}`;
          point7 = `${scaleDatumIncome + 30 - roofX },${this.halfOfHeight - 1 - 1}`;
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

  protected drawLeftSlider(x:number, init:boolean = false):this {
    this.sliderLeftBorder = x;

    if (!this.leftScrollOpacityStreet) {
      this.leftScrollOpacityStreet = this.svg
        .append('rect')
        .attr('class', 'left-scroll-opacity-part')
        .attr('x',-2)
        .attr('y', 0)
        .attr('height', 50)
        .style('fill', 'white')
        .style('opacity', '0.8');
    }

    if (!this.leftScrollOpacityLabels) {
      this.leftScrollOpacityLabels = this.svg;
      if (x < 52) {
        this.leftScrollOpacityLabels
          .append('rect')
          .attr('class', 'left-scroll-opacity-part2')
          .attr('x', 0)
          .attr('y', 50)
          .attr('height', 15)
          .style('fill', 'white')
          .attr('width', x + 30)
          .style('opacity', '0.1');
      } else {

        this.leftScrollOpacityLabels
          .append('rect')
          .attr('class', 'left-scroll-opacity-part2')
          .attr('x', 0)
          .attr('y', 50)
          .attr('height', 15)
          .style('fill', 'white')
          .attr('width', x + 30)
          .style('opacity', '0.8');
      }
    }

    if (!this.leftScroll) {
      this.leftScroll = this.svg
        .append('polygon')
        .attr('class', 'left-scroll')
        .style('fill', '#515c65')
        .style('cursor', 'pointer')
        .attr('stroke-width', 1)
        .attr('stroke', '#48545f')
        .on('mousedown', ():void => {
          d3.event.preventDefault();
          this.sliderLeftMove = true;
        })
        .on('touchstart', ():any => this.sliderLeftMove = true);
    }

    this.leftScroll
      .attr('points', () => {
        let point1 = `${x + 30 - 9},${ this.halfOfHeight + 12}`;
        let point2 = `${x + 30 - 9},${ this.halfOfHeight - 5}`;
        let point3 = `${x + 30 },${ this.halfOfHeight - 5}`;
        let point4 = `${x + 30 },${ this.halfOfHeight + 12}`;
        let point5 = `${x + 30 - 4.5},${ this.halfOfHeight + 12 + 5}`;

        return `${point1} ${point2} ${point3} ${point4} ${point5}`;
      });
    this.leftScrollOpacityStreet
      .attr('width', x + 30);

    this.lowIncome = this.scale.invert(x);

    if (init) {
      return this;
    }

    this.drawScrollLabel();

    return this;
  };

  protected drawRightSlider(x:number, init:boolean = false):this {
    this.sliderRightBorder = x;
    if (!this.rightScrollOpacityStreet) {
      this.rightScrollOpacityStreet = this.svg
        .append('rect')
        .attr('class', 'right-scroll-opacity-part')
        .attr('y', 0)
        .attr('x', 10)
        .attr('height', 50)
        .style('fill', 'white')
        .style('opacity', '0.8');
    }

    if (!this.rightScrollOpacityLabels) {

      this.rightScrollOpacityLabels = this.svg;
      if (x + 75 > this.width + 60) {
        this.rightScrollOpacityLabels
          .append('rect')
          .attr('class', 'right-scroll-opacity-part2')
          .attr('x', x + 9)
          .attr('y', 50)
          .attr('height', 15)
          .style('fill', 'white')
          .attr('width', this.width - x + 60)
          .style('opacity', '0.1');
      } else {

        this.rightScrollOpacityLabels
          .append('rect')
          .attr('class', 'right-scroll-opacity-part2')
          .attr('x', x + 20)
          .attr('y', 50)
          .attr('height', 15)
          .style('fill', 'white')
          .attr('width', this.width - x + 60)
          .style('opacity', '0.8');
      }
    }
    if (!this.rightScroll) {
      this.rightScroll = this.svg
        .append('polygon')
        .attr('class', 'right-scroll')
        .style('fill', '#515c65')
        .style('cursor', 'pointer')
        .attr('stroke-width', 1)
        .attr('stroke', '#48545f')
        .on('mousedown', ():void=> {
          d3.event.preventDefault();
          this.sliderRightMove = true;
        })
        .on('touchstart', ():any => this.sliderRightMove = true);
    }

    this.rightScroll.attr('points', () => {
      let point1 = `${x + 30},${ this.halfOfHeight + 12}`;
      let point2 = `${x + 30},${ this.halfOfHeight - 5}`;
      let point3 = `${x + 30 + 9},${ this.halfOfHeight - 5}`;
      let point4 = `${x + 30 + 9},${ this.halfOfHeight + 12}`;
      let point5 = `${x + 30 + 4.5},${ this.halfOfHeight + 12 + 5}`;
      return `${point1} ${point2} ${point3} ${point4} ${point5}`;
    });
    this.rightScrollOpacityStreet
      .attr('x', x + 30 + 1)
      .attr('width', this.width + 30 - x);

    this.highIncome = this.scale.invert(x);

    if (init) {
      return this;
    }

    this.drawScrollLabel();

    return this;
  };

  public clearAndRedraw(places:any, slider:boolean = false):this {
    if (!places || !places.length && !slider) {
      this.removeHouses('hover');
      this.removeHouses('chosen');

      return this;
    }

    this.removeHouses('hover');
    this.removeHouses('chosen');

    if (slider) {
      this.drawHoverHouse(places);

      return;
    }

    this.drawHouses(places);
    this.drawHoverHouse(this.hoverPlace);
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
    this.leftScrollOpacityStreet = void 0;
    this.leftScrollOpacityLabels = void 0;
    this.rightScrollOpacityLabels = void 0;
    this.rightScrollOpacityStreet = void 0;
    this.leftScrollText = void 0;
    this.rightScrollText = void 0;

    this.svg.selectAll('*').remove('*');

    return this;
  };

  private fillSpaces(income:any):string {
    return income.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
  };

  private drawScrollLabel():this {
    let incomeL:any = Math.round(this.lowIncome ? this.lowIncome : 0);
    let incomeR:any = Math.round(this.highIncome ? this.highIncome : 15000);
    if (incomeR > this.dividersData.rich) {
      incomeR = this.dividersData.rich;
    }
    let xL = this.scale(incomeL);
    let xR = this.scale(incomeR);

    if (((this.dividersData.lowDividerCoord / 1000 * (this.width + 30)) < xR + 45) && ((this.dividersData.lowDividerCoord / 1000 * (this.width + 30)) + 45 > xR) || ((this.dividersData.lowDividerCoord / 1000 * (this.width + 30)) < xL + 45) && ((this.dividersData.lowDividerCoord / 1000 * (this.width + 30)) + 45 > xL )) {
      this.svg.selectAll('text.scale-label' + this.dividersData.low).attr('fill', '#fff');
    } else {
      this.svg.selectAll('text.scale-label' + this.dividersData.low).attr('fill', '#767d86');
    }
    if (((this.dividersData.mediumDividerCoord / 1000 * (this.width + 30)) < xR + 110) && ((this.dividersData.mediumDividerCoord / 1000 * (this.width + 30)) + 25 > xR) || ((this.dividersData.mediumDividerCoord / 1000 * (this.width + 30)) < xL + 95) && ((this.dividersData.mediumDividerCoord / 1000 * (this.width + 30)) + 15 > xL )) {
      this.svg.selectAll('text.scale-label' + this.dividersData.medium).attr('fill', '#fff');
    } else {
      this.svg.selectAll('text.scale-label' + this.dividersData.medium).attr('fill', '#767d86');
    }

    if (((this.dividersData.highDividerCoord / 1000 * (this.width + 30)) < xR + 140) && ((this.dividersData.highDividerCoord / 1000 * (this.width + 30)) + 15 > xR) || ((this.dividersData.highDividerCoord / 1000 * (this.width + 30)) < xL + 134) && ((this.dividersData.highDividerCoord / 1000 * (this.width + 30)) > xL )) {
      this.svg.selectAll('text.scale-label' + this.dividersData.high).attr('fill', '#fff');
    } else {
      this.svg.selectAll('text.scale-label' + this.dividersData.high).attr('fill', '#767d86');
    }

    incomeL = this.fillSpaces(incomeL);
    incomeR = this.fillSpaces(incomeR);
    if ((xR + 75) > this.width) {
      this.svg.selectAll('text.richest').attr('fill', '#fff');
    }
    if ((xR + 75) < this.width) {
      this.svg.selectAll('text.richest').attr('fill', '#767d86');
    }

    if (xL < 55) {
      this.svg.selectAll('text.poorest').attr('fill', '#fff');
    }
    if (xL > 55) {
      this.svg.selectAll('text.poorest').attr('fill', '#767d86');
    }
    if (!this.leftScrollText) {
      this.leftScrollText = this.svg
        .append('text')
        .attr('class', 'left-scroll-label')
        .text(`${incomeL}$`)
        .attr('y', this.height)
        .attr('fill', '#767d86');
    }

    if (!this.rightScrollText) {
      this.rightScrollText = this.svg
        .append('text')
        .attr('class', 'right-scroll-label')
        .text(`${incomeR}$`)
        .attr('y', this.height)
        .attr('fill', '#767d86');
    }
    this.rightScrollText
      .text(`${incomeR}$`)
      .attr('x', ()=> xR + 30 - 10 - this.rightScrollText[0][0].getBBox().width / 2);

    this.leftScrollText
      .text(`${incomeL}$`)
      .attr('x', ()=> xL + 30 - 10 - this.leftScrollText[0][0].getBBox().width / 2);

    return this;
  };

  private drawHouses(places:any):this {
    if (!places || !places.length) {
      return this;
    }

    let halfHouseWidth = 10;
    let roofX = 2 - halfHouseWidth;
    let roofY = this.halfOfHeight - 12 - 1;

    this.svg.selectAll('polygon.chosen')
      .data(places)
      .enter()
      .append('polygon')
      .attr('class', 'chosen')
      .attr('points', (datum:any):any => {
        let point1;
        let point2;
        let point3;
        let point4;
        let point5;
        let point6;
        let point7;

        if (datum) {
          let scaleDatumIncome = this.scale(datum.income);
          point1 = `${30 + scaleDatumIncome + roofX},${this.halfOfHeight - 1 - 1}`;
          point2 = `${30 + scaleDatumIncome + roofX},${roofY}`;
          point3 = `${30 + scaleDatumIncome - halfHouseWidth },${roofY}`;
          point4 = `${30 + scaleDatumIncome },${ this.halfOfHeight - 21 - 1}`;
          point5 = `${30 + scaleDatumIncome + halfHouseWidth },${roofY}`;
          point6 = `${30 + scaleDatumIncome - roofX },${ roofY}`;
          point7 = `${30 + scaleDatumIncome - roofX },${ this.halfOfHeight - 1 - 1}`;
        }

        return !datum ? void 0 : point1 + ' ' + point2 + ' ' +
        point3 + ' ' + point4 + ' ' + point5 + ' ' + point6 + ' ' + point7;
      })
      .attr('stroke', '#303e4a')
      .attr('stroke-width', 1)
      .style('fill', '#374551');

    return this;
  };
}
