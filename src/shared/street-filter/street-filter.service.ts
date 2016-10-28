import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { MathService, DrawDividersInterface } from '../../common';

import { scaleLog } from 'd3-scale';
import { axisBottom } from 'd3-axis';
import { select } from 'd3-selection';

@Injectable()
export class StreetFilterDrawService {
  public width: number;
  public height: number;
  public halfOfHeight: number;
  public lowIncome: number;
  public highIncome: number;
  public streetOffset: number = 60;
  public halfOfStreetOffset: number = 30;
  private scale: any;
  private axisLabel: number[] = [];
  private svg: any;
  private incomeArr: any[] = [];
  private dividersData: any;
  private touchMoveSubscriber: any;
  private touchUpSubscriber: any;
  private sliderRightBorder: number;
  private sliderLeftBorder: number;
  private sliderRightMove: boolean = false;
  private sliderLeftMove: boolean = false;
  private draggingSliders: boolean = false;
  private distanceDraggingLeftSlider: number = 0;
  private distanceDraggingRightSlider: number = 0;
  private leftScroll: any;
  private rightScroll: any;
  private leftScrollOpacityStreet: any;
  private leftScrollOpacityLabels: any;
  private leftScrollOpacityHomes: any;
  private rightScrollOpacityStreet: any;
  private rightScrollOpacityLabels: any;
  private rightScrollOpacityHomes: any;
  private leftScrollText: any;
  private rightScrollText: any;
  private math: MathService;
  private filter: Subject<any> = new Subject<any>();

  public constructor(math: MathService) {
    this.math = math;
  }

  public init(lowIncome: any, highIncome: any, drawDividers: DrawDividersInterface): this {
    this.axisLabel = [drawDividers.low, drawDividers.medium, drawDividers.high];
    this.dividersData = drawDividers;
    this.lowIncome = lowIncome || drawDividers.poor;
    this.highIncome = highIncome || drawDividers.rich;
    this.width = parseInt(this.svg.style('width'), 10) - this.streetOffset;
    this.height = parseInt(this.svg.style('height'), 10);
    this.halfOfHeight = 0.5 * this.height;

    this.scale = scaleLog()
      .domain([drawDividers.poor, drawDividers.low, drawDividers.medium, drawDividers.high, drawDividers.rich])
      .range([0, drawDividers.lowDividerCoord / 1000 * this.width, drawDividers.mediumDividerCoord / 1000 * this.width, drawDividers.highDividerCoord / 1000 * this.width, this.width]);

    return this;
  }

  public set setSvg(element: HTMLElement) {
    this.svg = select(element);
  }

  public set(key: any, val: any): this {
    this[key] = val;

    return this;
  };

  public isDrawDividers(drawDividers: DrawDividersInterface): this {
    if (!drawDividers.showDividers) {
      return;
    }

    this.svg
      .selectAll('text.scale-label')
      .data(this.axisLabel)
      .enter()
      .append('text')
      .text((d: any) => {
        return this.math.round(d) + '$';
      })
      .attr('x', (d: any) => {
        let indent = 0;

        if ((d + '').length === 2) {
          indent = 11;
        }

        if ((d + '').length === 3) {
          indent = 15;
        }

        return this.scale(d) - indent + 25;
      })
      .attr('class', (d: any) => {
        return 'scale-label' + d;
      })
      .attr('y', this.height)
      .attr('fill', '#767d86');

    this.svg
      .selectAll('image.scale-label')
      .data(this.axisLabel)
      .enter()
      .append('svg:image')
      .attr('class', 'scale-label')
      .attr('xlink:href', '/assets/img/divider1.svg')
      .attr('y', 25)
      .attr('width', 15 + 19)
      .attr('height', 24)
      .attr('x', (d: any) => {
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
      })
      .on('mousedown', (): void => {
        // (d3.event as any).preventDefault();
        this.draggingSliders = true;
      })
      .on('touchstart', (): any => this.draggingSliders = true);

    return this;
  }

  public drawScale(places: any, drawDividers: any): this {
    let halfHouseWidth = 7;
    let roofX = 2 - halfHouseWidth;
    let roofY = this.halfOfHeight - 10;

    if (!places || !places.length) {
      return this;
    }

    axisBottom(this.scale)
    .tickFormat(() => {
      return void 0;
    });
    // .tickSize(6, 0);

    this.svg
      .selectAll('polygon')
      .data(places)
      .enter()
      .append('polygon')
      .attr('class', 'point')
      .attr('points', (datum: any): any => {
        let point1;
        let point2;
        let point3;
        let point4;
        let point5;
        let point6;
        let point7;

        if (datum) {
          let scaleDatumIncome = this.scale(datum.income);
          point1 = `${this.halfOfStreetOffset + scaleDatumIncome + roofX },${this.halfOfHeight - 4}`;
          point2 = `${this.halfOfStreetOffset + scaleDatumIncome + roofX},${roofY}`;
          point3 = `${this.halfOfStreetOffset + scaleDatumIncome - halfHouseWidth},${roofY}`;
          point4 = `${this.halfOfStreetOffset + scaleDatumIncome},${this.halfOfHeight - 17}`;
          point5 = `${this.halfOfStreetOffset + scaleDatumIncome + halfHouseWidth },${roofY}`;
          point6 = `${this.halfOfStreetOffset + scaleDatumIncome - roofX },${roofY}`;
          point7 = `${this.halfOfStreetOffset + scaleDatumIncome - roofX },${this.halfOfHeight - 4}`;
        }

        return !datum ? void 0 : point1 + ' ' + point2 + ' ' +
        point3 + ' ' + point4 + ' ' + point5 + ' ' + point6 + ' ' + point7;
      })
      .attr('stroke-width', 1)
      .style('fill', '#cfd2d6')
      .style('opacity', '0.6');

    this.svg
      .append('polygon')
      .attr('class', 'road')
      .attr('height', '14px')
      .attr('points', () => {
        let point1 = `0,${this.halfOfHeight + 11}`;
        let point2 = `30,${this.halfOfHeight - 4}`;
        let point3 = `${this.width + this.halfOfStreetOffset},${this.halfOfHeight - 4}`;
        let point4 = `${this.width + this.streetOffset},${this.halfOfHeight + 11}`;
        return `${point1} ${point2} ${point3} ${point4}`;
      })
      .style('fill', '#727a82')
      .style('cursor', '-webkit-grab')
      .style('cursor', '-moz-grab')
      .style('cursor', 'grab')
      .on('mousedown', (): void => {
        // (d3.event as any).preventDefault();
        this.draggingSliders = true;
      })
      .on('touchstart', (): any => this.draggingSliders = true);

    this.svg
      .append('line')
      .attr('class', 'axis')
      .attr('height', '3px')
      .attr('x1', 1)
      .attr('y1', this.halfOfHeight + 12)
      .attr('x2', this.width + this.streetOffset - 1)
      .attr('y2', this.halfOfHeight + 12)
      .attr('stroke-width', 3)
      .attr('stroke', '#525c64')
      .style('cursor', '-webkit-grab')
      .style('cursor', '-moz-grab')
      .style('cursor', 'grab')
      .on('mousedown', (): void => {
        // (d3.event as any).preventDefault();
        this.draggingSliders = true;
      })
      .on('touchstart', (): any => this.draggingSliders = true);

    this.svg
      .append('line')
      .attr('class', 'dash')
      .attr('x1', 24)
      .attr('y1', this.halfOfHeight + 4)
      .attr('x2', this.width + this.streetOffset - 9)
      .attr('y2', this.halfOfHeight + 3)
      .attr('stroke-dasharray', '17')
      .attr('stroke-width', 2)
      .attr('stroke', 'white')
      .style('cursor', '-webkit-grab')
      .style('cursor', '-moz-grab')
      .style('cursor', 'grab')
      .on('mousedown', (): void => {
        // (d3.event as any).preventDefault();
        this.draggingSliders = true;
      })
      .on('touchstart', (): any => this.draggingSliders = true);

    this.incomeArr.length = 0;

    this.isDrawDividers(drawDividers);

    this.drawLeftSlider(this.scale(this.lowIncome), true);
    this.drawRightSlider(this.scale(this.highIncome));

    if (this.touchMoveSubscriber) {
      this.touchMoveSubscriber.unsubscribe();
    }

    this.touchMoveSubscriber = fromEvent(window, 'touchmove')
      .subscribe((e: TouchEvent)=> {
        if (!this.sliderLeftMove && !this.sliderRightMove && !this.draggingSliders) {
          return;
        }

        let positionX = e.touches[0].pageX;

        if (this.draggingSliders && !this.sliderLeftMove && !this.sliderRightMove) {
          document.body.classList.add('draggingSliders');

          // todo: distance from cursor to sliders
          if (!this.distanceDraggingLeftSlider) {
            this.distanceDraggingLeftSlider = positionX - 35 - this.sliderLeftBorder;
          }

          if (!this.distanceDraggingRightSlider) {
            this.distanceDraggingRightSlider = this.sliderRightBorder - (positionX - 40);
          }

          if (
            positionX - this.distanceDraggingLeftSlider >= 30 &&
            positionX + this.distanceDraggingRightSlider <= this.width + 45) {
            this.drawLeftSlider(positionX - 30 - this.distanceDraggingLeftSlider);
            this.drawRightSlider(positionX - 40 + this.distanceDraggingRightSlider);
            return;
          }
          return;
        }

        if (this.sliderLeftMove && positionX <= this.sliderRightBorder - 25 && positionX >= 30) {
          return this.drawLeftSlider(positionX - 30);
        }

        if (this.sliderRightMove && this.sliderLeftBorder + 102 <= positionX && positionX <= this.width + 45) {
          return this.drawRightSlider(positionX - 40);
        }
      });

    if (this.touchUpSubscriber) {
      this.touchUpSubscriber.unsubscribe();
    }

    this.touchUpSubscriber = fromEvent(window, 'touchend')
      .subscribe(()=> {
        if (!this.sliderLeftMove && !this.sliderRightMove && !this.draggingSliders) {
          return;
        }

        this.draggingSliders = this.sliderLeftMove = this.sliderRightMove = false;
        this.distanceDraggingLeftSlider = 0;
        this.distanceDraggingRightSlider = 0;

        document.body.classList.remove('draggingSliders');

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

  protected drawLeftSlider(x: number, init: boolean = false): this {
    this.sliderLeftBorder = x;

    if (!this.leftScrollOpacityHomes) {
      this.leftScrollOpacityHomes = this.svg
        .append('rect')
        .attr('class', 'left-scroll-opacity-part-homes')
        .attr('x', -2)
        .attr('y', 0)
        .attr('height', 28.8)
        .style('fill', 'white')
        .style('opacity', '0.6');
    }

    if (!this.leftScrollOpacityStreet) {
      this.leftScrollOpacityStreet = this.svg
        .append('rect')
        .attr('class', 'left-scroll-opacity-part-street')
        .attr('x', -2)
        .attr('y', 28.5)
        .attr('height', 21)
        .style('fill', 'white')
        .style('opacity', '0.8');
    }

    if (!this.leftScrollOpacityLabels) {
      this.leftScrollOpacityLabels = this.svg;

      if (x < 16) {
        this.leftScrollOpacityLabels
          .append('rect')
          .attr('class', 'left-scroll-opacity-part2')
          .attr('x', 0)
          .attr('y', 50)
          .attr('height', 15)
          .style('fill', 'white')
          .attr('width', x + this.halfOfStreetOffset)
          .style('opacity', '0.1');
      } else {
        this.leftScrollOpacityLabels
          .append('rect')
          .attr('class', 'left-scroll-opacity-part2')
          .attr('x', 0)
          .attr('y', 50)
          .attr('height', 15)
          .style('fill', 'white')
          .attr('width', x + this.halfOfStreetOffset)
          .style('opacity', '0.8');
      }
    }

    if (!this.leftScroll) {
      this.leftScroll = this.svg
        .append('polygon')
        .attr('class', 'left-scroll')
        .style('fill', '#515c65')
        .style('cursor', 'pointer')
        .attr('stroke-width', 0.5)
        .attr('stroke', '#ffffff')
        .on('mousedown', (): void => {
          // (d3.event as any).preventDefault();
          this.sliderLeftMove = true;
        })
        .on('touchstart', (): any => this.sliderLeftMove = true);
    }

    this.leftScroll
      .attr('points', () => {
        let point1 = `${x + this.halfOfStreetOffset - 11},${ this.halfOfHeight + 12 - 1}`;
        let point2 = `${x + this.halfOfStreetOffset - 11},${ this.halfOfHeight - 7.5 - 1}`;
        let point3 = `${x + this.halfOfStreetOffset },${ this.halfOfHeight - 7.5 - 1}`;
        let point4 = `${x + this.halfOfStreetOffset },${ this.halfOfHeight + 12 - 1}`;
        let point5 = `${x + this.halfOfStreetOffset - 5.5},${ this.halfOfHeight + 12 + 7.5 - 1}`;

        return `${point1} ${point2} ${point3} ${point4} ${point5}`;
      });

    this.leftScrollOpacityStreet
      .attr('width', x + this.halfOfStreetOffset);
    this.leftScrollOpacityHomes
      .attr('width', x + this.halfOfStreetOffset);

    this.lowIncome = this.scale.invert(x);

    if (init) {
      return this;
    }

    this.drawScrollLabel();

    return this;
  };

  protected drawRightSlider(x: number): this {
    this.sliderRightBorder = x;

    if (!this.rightScrollOpacityHomes) {
      this.rightScrollOpacityHomes = this.svg
        .append('rect')
        .attr('class', 'left-scroll-opacity-part-homes')
        .attr('x', -2)
        .attr('y', 0)
        .attr('height', 28.8)
        .style('fill', 'white')
        .style('opacity', '0.65');
    }

    if (!this.rightScrollOpacityStreet) {
      this.rightScrollOpacityStreet = this.svg
        .append('rect')
        .attr('class', 'left-scroll-opacity-part-street')
        .attr('x', -2)
        .attr('y', 28.5)
        .attr('height', 21)
        .style('fill', 'white')
        .style('opacity', '0.8');
    }

    if (!this.rightScrollOpacityLabels) {
      this.rightScrollOpacityLabels = this.svg;

      if (x + 75 > this.width + this.streetOffset) {
        this.rightScrollOpacityLabels
          .append('rect')
          .attr('class', 'right-scroll-opacity-part2')
          .attr('x', x + 9)
          .attr('y', 50)
          .attr('height', 15)
          .style('fill', 'white')
          .attr('width', this.width - x + this.streetOffset)
          .style('opacity', '0.1');
      } else {
        this.rightScrollOpacityLabels
          .append('rect')
          .attr('class', 'right-scroll-opacity-part2')
          .attr('x', x + 20)
          .attr('y', 50)
          .attr('height', 15)
          .style('fill', 'white')
          .attr('width', this.width - x + this.streetOffset)
          .style('opacity', '0.8');
      }
    }

    if (!this.rightScroll) {
      this.rightScroll = this.svg
        .append('polygon')
        .attr('class', 'right-scroll')
        .style('fill', '#515c65')
        .style('cursor', 'pointer')
        .attr('stroke-width', 0.5)
        .attr('stroke', '#ffffff')
        .on('mousedown', (): void=> {
          // (d3.event as any).preventDefault();
          this.sliderRightMove = true;
        })
        .on('touchstart', (): any => this.sliderRightMove = true);
    }

    this.rightScroll.attr('points', () => {
      let point1 = `${x + this.halfOfStreetOffset},${ this.halfOfHeight + 12 - 1}`;
      let point2 = `${x + this.halfOfStreetOffset},${ this.halfOfHeight - 7.5 - 1}`;
      let point3 = `${x + this.halfOfStreetOffset + 11},${ this.halfOfHeight - 7.5 - 1}`;
      let point4 = `${x + this.halfOfStreetOffset + 11},${ this.halfOfHeight + 12 - 1}`;
      let point5 = `${x + this.halfOfStreetOffset + 5.5},${ this.halfOfHeight + 12 + 7.5 - 1}`;

      return `${point1} ${point2} ${point3} ${point4} ${point5}`;
    });

    this.rightScrollOpacityStreet.attr('x', x + this.halfOfStreetOffset + 1.5)
      .attr('width', this.width + this.halfOfStreetOffset - x);
    this.rightScrollOpacityHomes.attr('x', x + this.halfOfStreetOffset + 1.5)
      .attr('width', this.width + this.halfOfStreetOffset - x);
    this.highIncome = this.scale.invert(x);

    this.drawScrollLabel();

    return this;
  };

  public clearSvg(): this {
    this.leftScroll = void 0;
    this.rightScroll = void 0;
    this.leftScrollOpacityStreet = void 0;
    this.leftScrollOpacityLabels = void 0;
    this.leftScrollOpacityHomes = void 0;
    this.rightScrollOpacityLabels = void 0;
    this.rightScrollOpacityStreet = void 0;
    this.rightScrollOpacityHomes = void 0;
    this.leftScrollText = void 0;
    this.rightScrollText = void 0;

    this.svg.selectAll('*').remove();

    return this;
  };

  private drawScrollLabel(): this {
    let incomeL: any = Math.round(this.lowIncome ? this.lowIncome : 0);
    let incomeR: any = Math.round(this.highIncome ? this.highIncome : this.dividersData.rich);

    if (incomeR > this.dividersData.rich) {
      incomeR = this.dividersData.rich;
    }

    let xL = this.scale(incomeL);
    let xR = this.scale(incomeR);

    if (((this.dividersData.lowDividerCoord / 1000 * (this.width + this.halfOfStreetOffset)) < xR + 45) && ((this.dividersData.lowDividerCoord / 1000 * (this.width + this.halfOfStreetOffset)) + 45 > xR) || ((this.dividersData.lowDividerCoord / 1000 * (this.width + this.halfOfStreetOffset)) < xL + 45) && ((this.dividersData.lowDividerCoord / 1000 * (this.width + this.halfOfStreetOffset)) + 45 > xL )) {
      this.svg.selectAll('text.scale-label' + this.dividersData.low).attr('fill', '#fff');
    } else {
      this.svg.selectAll('text.scale-label' + this.dividersData.low).attr('fill', '#767d86');
    }

    if (((this.dividersData.mediumDividerCoord / 1000 * (this.width + this.halfOfStreetOffset)) < xR + 115) && ((this.dividersData.mediumDividerCoord / 1000 * (this.width + this.halfOfStreetOffset)) + 55 > xR) || ((this.dividersData.mediumDividerCoord / 1000 * (this.width + this.halfOfStreetOffset)) < xL + 115) && ((this.dividersData.mediumDividerCoord / 1000 * (this.width + this.halfOfStreetOffset)) + 55 > xL )) {
      this.svg.selectAll('text.scale-label' + this.dividersData.medium).attr('fill', '#fff');
    } else {
      this.svg.selectAll('text.scale-label' + this.dividersData.medium).attr('fill', '#767d86');
    }

    if (((this.dividersData.highDividerCoord / 1000 * (this.width + this.halfOfStreetOffset)) < xR + 140) && ((this.dividersData.highDividerCoord / 1000 * (this.width + this.halfOfStreetOffset)) + 65 > xR) || ((this.dividersData.highDividerCoord / 1000 * (this.width + this.halfOfStreetOffset)) < xL + 140) && ((this.dividersData.highDividerCoord / 1000 * (this.width + this.halfOfStreetOffset)) + 65 > xL )) {
      this.svg.selectAll('text.scale-label' + this.dividersData.high).attr('fill', '#fff');
    } else {
      this.svg.selectAll('text.scale-label' + this.dividersData.high).attr('fill', '#767d86');
    }

    incomeL = this.math.round(incomeL);
    incomeR = this.math.round(incomeR);

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
        .text(`$${incomeL}`)
        .attr('y', 10)
        .attr('fill', '#767d86');
    }

    if (!this.rightScrollText) {
      this.rightScrollText = this.svg
        .append('text')
        .attr('class', 'right-scroll-label')
        .text(`$${incomeR}`)
        .attr('y', 10)
        .attr('fill', '#767d86');
    }

    this.leftScrollText
      .text(`$${incomeL}`)
      .attr('x', ()=> xL + this.halfOfStreetOffset - 5.5 - parseInt(this.leftScrollText.style('width'), 10) / 2);

    this.rightScrollText
      .text(`$${incomeR}`)
      .attr('x', ()=> xR + this.halfOfStreetOffset + 5.5 - parseInt(this.rightScrollText.style('width'), 10) / 2);
    return this;
  };
}
