import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { MathService, DrawDividersInterface } from '../../common';
import { scaleLog } from 'd3-scale';
import { axisBottom } from 'd3-axis';
import { select } from 'd3-selection';
import { Place } from '../../interfaces';
import { SVG_DEFAULTS } from '../street/svg-parameters';

@Injectable()
export class StreetFilterDrawService {
  public width: number;
  public height: number;
  public halfOfHeight: number;
  public lowIncome: number;
  public highIncome: number;
  public streetOffset: number = 60;
  public halfOfStreetOffset: number = 30;
  public scale: any;
  public axisLabel: number[] = [];
  public svg: any;
  public incomeArr: any[] = [];
  public dividersData: any;
  public touchMoveSubscriber: any;
  public touchUpSubscriber: any;
  public sliderRightBorder: number;
  public sliderLeftBorder: number;
  public sliderRightMove: boolean = false;
  public sliderLeftMove: boolean = false;
  public draggingSliders: boolean = false;
  public distanceDraggingLeftSlider: number = 0;
  public distanceDraggingRightSlider: number = 0;
  public leftScroll: any;
  public rightScroll: any;
  public leftScrollOpacityStreet: any;
  public leftScrollOpacityLabels: any;
  public leftScrollOpacityHomes: any;
  public rightScrollOpacityStreet: any;
  public rightScrollOpacityLabels: any;
  public rightScrollOpacityHomes: any;
  public leftScrollText: any;
  public rightScrollText: any;
  public math: MathService;
  public filter: Subject<any> = new Subject<any>();
  public currencyUnit: any;

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
      .domain([drawDividers.poor, drawDividers.rich])
      .range([0, this.width]);

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
        return `${this.math.roundIncome(d * this.currencyUnit.value)}${this.currencyUnit.symbol}`;
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

    this.svg.selectAll('use.square-point')
      .data(this.axisLabel)
      .enter()
      .append('use')
      .attr('xlink:href', SVG_DEFAULTS.squarePoints.name)
      .attr("fill", SVG_DEFAULTS.squarePoints.color)
      .attr('class', 'square-point')
      .attr('width', SVG_DEFAULTS.squarePoints.width)
      .attr('height', SVG_DEFAULTS.squarePoints.height)
      .attr('y', SVG_DEFAULTS.squarePoints.positionY)
      .attr('x', (d: number) => {
        const x = this.scale(d)

        return x;
      })
      .on('mousedown', (): void => {
      this.draggingSliders = true;
    }, {passive: true})
      .on('touchstart', (): any => this.draggingSliders = true, { passive: true });

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

    // this.svg
    //   .selectAll('polygon')
    //   .data(places)
    //   .enter()
    //   .append('polygon')
    //   .attr('class', 'point')
    //   .attr('points', (datum: any): any => {
    //     let point1: string;
    //     let point2: string;
    //     let point3: string;
    //     let point4: string;
    //     let point5: string;
    //     let point6: string;
    //     let point7: string;
    //
    //     if (datum) {
    //       let scaleDatumIncome = this.scale(datum.income);
    //       point1 = `${this.halfOfStreetOffset + scaleDatumIncome + roofX },${this.halfOfHeight - 4}`;
    //       point2 = `${this.halfOfStreetOffset + scaleDatumIncome + roofX},${roofY}`;
    //       point3 = `${this.halfOfStreetOffset + scaleDatumIncome - halfHouseWidth},${roofY}`;
    //       point4 = `${this.halfOfStreetOffset + scaleDatumIncome},${this.halfOfHeight - 17}`;
    //       point5 = `${this.halfOfStreetOffset + scaleDatumIncome + halfHouseWidth },${roofY}`;
    //       point6 = `${this.halfOfStreetOffset + scaleDatumIncome - roofX },${roofY}`;
    //       point7 = `${this.halfOfStreetOffset + scaleDatumIncome - roofX },${this.halfOfHeight - 4}`;
    //     }
    //
    //     return !datum ? void 0 : point1 + ' ' + point2 + ' ' +
    //     point3 + ' ' + point4 + ' ' + point5 + ' ' + point6 + ' ' + point7;
    //   })
    //   .attr('stroke-width', 1)
    //   .style('fill', '#cfd2d6')
    //   .style('opacity', '0.6');

    this.svg
      .selectAll('use.icon-background-home')
      .data(places)
      .enter()
      .append('use')
      .attr('class', 'icon-background-home')
      .attr('y', SVG_DEFAULTS.backgroungHomes.positionY)
      .attr('width', SVG_DEFAULTS.backgroungHomes.width)
      .attr('height', SVG_DEFAULTS.backgroungHomes.height)
      .attr('fill', SVG_DEFAULTS.backgroungHomes.fill)
      .attr('xlink:href', SVG_DEFAULTS.backgroungHomes.name)
      .attr('income', (datum: Place) => {
        return datum.income;
      })
      .attr('home-id', (datum: Place) => {
        return datum._id;
      })
      .attr('x', (datum: Place) => {
        const scaleDatumIncome = this.scale(datum.income);
        const position = this.streetOffset / 2 - SVG_DEFAULTS.backgroungHomes.width / 2 + scaleDatumIncome;

        return position;
      });

    this.svg
      .append('polygon')
      .attr('class', 'road')
      .attr('height', '14px')
      .attr('points', () => {
        let point1: string = `0,${this.halfOfHeight + 11}`;
        let point2: string = `30,${this.halfOfHeight - 4}`;
        let point3: string = `${this.width + this.halfOfStreetOffset},${this.halfOfHeight - 4}`;
        let point4: string = `${this.width + this.streetOffset},${this.halfOfHeight + 11}`;
        return `${point1} ${point2} ${point3} ${point4}`;
      })
      .style('fill', '#727a82')
      .style('cursor', '-webkit-grab')
      .style('cursor', '-moz-grab')
      .style('cursor', 'grab')
      .on('mousedown', (): void => {
        this.draggingSliders = true;
      })
      .on('touchstart', (): any => this.draggingSliders = true, { passive: true });

    this.svg
      .append('line')
      .attr('class', 'axis')
      .attr('height', '3px')
      .attr('x1', 1)
      .attr('y1', this.halfOfHeight + 12)
      .attr('x2', this.width + this.streetOffset - 1)
      .attr('y2', this.halfOfHeight + 12)
      .attr('stroke-width', SVG_DEFAULTS.road.line.height)
      .attr('stroke', SVG_DEFAULTS.road.line.color)
      .style('cursor', '-webkit-grab')
      .style('cursor', '-moz-grab')
      .style('cursor', 'grab')
      .on('mousedown', (): void => {
        this.draggingSliders = true;
      })
      .on('touchstart', (): any => this.draggingSliders = true, { passive: true });

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
        this.draggingSliders = true;
      })
      .on('touchstart', (): any => this.draggingSliders = true, { passive: true });

    this.incomeArr.length = 0;

    this.isDrawDividers(drawDividers);

    this.drawLeftSlider(this.scale(this.lowIncome), true);
    this.drawRightSlider(this.scale(this.highIncome));

    if (this.touchMoveSubscriber) {
      this.touchMoveSubscriber.unsubscribe();
    }

    this.touchMoveSubscriber = fromEvent(window, 'touchmove', { passive: true })
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

    this.touchUpSubscriber = fromEvent(window, 'touchend', { passive: true })
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

  public drawLeftSlider(x: number, init: boolean = false): this {
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
        .append('use')
        .attr('class', 'left-scroll')
        .style('fill', SVG_DEFAULTS.sliders.color)
        .attr('id', 'left-scroll')
        .attr('xlink:href', SVG_DEFAULTS.sliders.name)
        .attr('width', SVG_DEFAULTS.sliders.width)
        .attr('height', SVG_DEFAULTS.sliders.height)
        .attr('y', SVG_DEFAULTS.sliders.positionY)
        .on('mousedown', (): void => {
          this.sliderLeftMove = true;
        })
        .on('touchstart', (): any => this.sliderLeftMove = true, { passive: true });
    }

    this.leftScroll
      .attr('x',  x);

    this.leftScrollOpacityStreet
      .attr('width', x + this.halfOfStreetOffset - this.scale(SVG_DEFAULTS.sliders.width) / 2);
    this.leftScrollOpacityHomes
      .attr('width', x + this.halfOfStreetOffset - this.scale(SVG_DEFAULTS.sliders.width) / 2);

    this.lowIncome = this.scale.invert(x);

    if (init) {
      return this;
    }

    this.drawScrollLabel();

    return this;
  };

  public drawRightSlider(x: number): this {
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
        .append('use')
        .attr('class', 'right-scroll')
        .style('fill', SVG_DEFAULTS.sliders.color)
        .attr('id', 'right-scroll')
        .attr('xlink:href', SVG_DEFAULTS.sliders.name)
        .attr('width', SVG_DEFAULTS.sliders.width)
        .attr('height', SVG_DEFAULTS.sliders.height)
        .attr('y', SVG_DEFAULTS.sliders.positionY)
        .on('mousedown', (): void => {
          this.sliderRightMove = true;
        })
        .on('touchstart', (): any => this.sliderRightMove = true, { passive: true });
    }

    this.rightScroll
      .attr('x',  x);

    this.rightScrollOpacityStreet.attr('x', x + this.halfOfStreetOffset - this.scale(SVG_DEFAULTS.sliders.width) / 2)
      .attr('width', this.width + this.halfOfStreetOffset - this.scale(SVG_DEFAULTS.sliders.width) / 2);
    this.rightScrollOpacityHomes.attr('x', x + this.halfOfStreetOffset - this.scale(SVG_DEFAULTS.sliders.width) / 2)
      .attr('width', this.width + this.halfOfStreetOffset - this.scale(SVG_DEFAULTS.sliders.width) / 2);
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

  public drawScrollLabel(): this {
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

    incomeL = this.math.roundIncome(incomeL * this.currencyUnit.value);
    incomeR = this.math.roundIncome(incomeR * this.currencyUnit.value);

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
        .text(`${this.currencyUnit.symbol}${incomeL}`)
        .attr('y', 12)
        .attr('fill', '#767d86');
    }

    if (!this.rightScrollText) {
      this.rightScrollText = this.svg
        .append('text')
        .attr('class', 'right-scroll-label')
        .text(`${this.currencyUnit.symbol}${incomeR}`)
        .attr('y', 12)
        .attr('fill', '#767d86');
    }

    const leftScrollTextStyle: {width: any; height: any;} = this.leftScrollText.node().getBBox();
    const rightScrollTextStyle: {width: any; height: any;} = this.rightScrollText.node().getBBox();

    const leftScrollTextWidth: number = parseInt(leftScrollTextStyle.width, 10);
    const rightScrollTextWidth: number = parseInt(rightScrollTextStyle.width, 10);

    this.leftScrollText
      .text(`${this.currencyUnit.symbol}${incomeL}`)
      .attr('x', ()=> xL + this.halfOfStreetOffset - 5.5 - leftScrollTextWidth / 2);

    this.rightScrollText
      .text(`${this.currencyUnit.symbol}${incomeR}`)
      .attr('x', ()=> xR + this.halfOfStreetOffset + 5.5 - rightScrollTextWidth / 2);
    return this;
  };
}
