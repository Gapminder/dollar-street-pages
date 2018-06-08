import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { MathService, DrawDividersInterface } from '../../common';
import { scaleLog } from 'd3-scale';
import { axisBottom } from 'd3-axis';
import { select } from 'd3-selection';
import { Place, Currency, SubscriptionsList, DividersGaps } from '../../interfaces';
import { SVG_DEFAULTS } from '../street/svg-parameters';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

@Injectable()
export class StreetFilterDrawService {
  width: number;
  height: number;
  halfOfHeight: number;
  lowIncome: number;
  highIncome: number;
  streetOffset = 60;
  halfOfStreetOffset = 30;
  scale;
  axisLabel: number[] = [];
  svg;
  incomeArr: any[] = [];
  dividersData;
  touchMoveSubscriber;
  touchUpSubscriber;
  sliderRightBorder: number;
  sliderLeftBorder: number;
  sliderRightMove = false;
  sliderLeftMove = false;
  draggingSliders = false;
  distanceDraggingLeftSlider = 0;
  distanceDraggingRightSlider = 0;
  leftScroll;
  rightScroll;
  leftScrollOpacityStreet;
  leftScrollOpacityLabels;
  leftScrollOpacityHomes;
  rightScrollOpacityStreet;
  rightScrollOpacityLabels;
  rightScrollOpacityHomes;
  leftScrollText;
  rightScrollText;
  math: MathService;
  filter: Subject<any> = new Subject<any>();
  currencyUnit: Currency;
  ngSubscribtions: SubscriptionsList = {};

  constructor(math: MathService) {
    this.math = math;
  }

  init(lowIncome, highIncome, drawDividers: DrawDividersInterface): this {
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

  set setSvg(element: HTMLElement) {
    this.svg = select(element);
  }

  set(key, val): this {
    this[key] = val;

    return this;
  };

  isDrawDividers(drawDividers: DrawDividersInterface): this {
    if (!drawDividers.showDividers) {
      return;
    }

    this.svg
      .selectAll('text.scale-label')
      .data(this.axisLabel)
      .enter()
      .append('text')
      .text((d) => {
        return `${this.math.roundIncome(d * this.currencyUnit.value)}${this.currencyUnit.symbol}`;
      })
      .attr('x', (d) => {
        return this.scale(d) + this.streetOffset/2;
        //return this.scale(d);
      })
      .attr('class', (d) => {
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

        const x = this.scale(d) - (SVG_DEFAULTS.squarePoints.width / 2) + (this.streetOffset / 2);

        return x;
      })
      .on('mousedown', (): void => {
      this.draggingSliders = true;
    }, {passive: true})
      .on('touchstart', () => this.draggingSliders = true, { passive: true });

    return this;
  }

  drawScale(places, drawDividers): this {
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
      .on('touchstart', () => this.draggingSliders = true, { passive: true });

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
      .on('touchstart', () => this.draggingSliders = true, { passive: true });

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
      .on('touchstart', () => this.draggingSliders = true, { passive: true });

    this.incomeArr.length = 0;

    this.isDrawDividers(drawDividers);

    this.drawLeftSlider(this.scale(this.lowIncome), true);
    this.drawRightSlider(this.scale(this.highIncome));

    if (_.get(this.ngSubscribtions, 'touchMove', false)) {
      this.ngSubscribtions.touchMove.unsubscribe();
    }

    this.ngSubscribtions.touchMove = fromEvent(window, 'touchmove', { passive: true })
      .subscribe((e: TouchEvent)=> {
        const touch: Touch = e.touches[0];

        this.onMouseEvent(touch);
      });

    if (_.get(this.ngSubscribtions, 'mouseMove', false)) {
      this.ngSubscribtions.mouseMove.unsubscribe();
    }

    this.ngSubscribtions.mouseMove = fromEvent(window, 'mousemove', { passive: true })
      .subscribe( (e: MouseEvent) => {

        this.onMouseEvent(e);
      });

    if (_.get(this.ngSubscribtions, 'touchUp', false)) {
      this.ngSubscribtions.touchUp.unsubscribe();
    }

    this.ngSubscribtions.mouseUp = fromEvent(window, 'mouseup' , { passive: true })
    .subscribe(() => {

      if (!this.sliderLeftMove && !this.sliderRightMove && !this.draggingSliders) {
        return;
      }

      this.pressedSlider();
    });

    this.ngSubscribtions.touchUp = fromEvent(window, 'touchend', { passive: true })
      .subscribe(() => {
        if (!this.sliderLeftMove && !this.sliderRightMove && !this.draggingSliders) {
          return;
        }

        this.pressedSlider();
      });

    return this;
  };

  

  pressedSlider(): void {
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
  }

  onMouseEvent(e: MouseEvent | Touch): void | this {

    if (!this.sliderLeftMove && !this.sliderRightMove && !this.draggingSliders) {
      return;
    }

    let positionX = e.pageX;

    if (this.draggingSliders && !this.sliderLeftMove && !this.sliderRightMove) {
      document.body.classList.add('draggingSliders');

      // todo: distance from cursor to sliders
      if (!this.distanceDraggingLeftSlider) {
        this.distanceDraggingLeftSlider = positionX - this.streetOffset/2 - this.sliderLeftBorder;
      }

      if (!this.distanceDraggingRightSlider) {
        this.distanceDraggingRightSlider = this.sliderRightBorder - (positionX - this.streetOffset/2);
      }

      if (
        positionX - this.distanceDraggingLeftSlider >= 30 &&
        positionX + this.distanceDraggingRightSlider <= this.width + 45) {
        this.drawLeftSlider(positionX - this.streetOffset/2 - this.distanceDraggingLeftSlider);
        this.drawRightSlider(positionX - this.streetOffset/2 + this.distanceDraggingRightSlider);
        return;
      }
      return;
    }

    if (this.sliderLeftMove && positionX <= this.sliderRightBorder - 25 && positionX >= 30) {

      return this.drawLeftSlider(positionX - this.streetOffset/2);
    }

    if (this.sliderRightMove && this.sliderLeftBorder + 102 <= positionX && positionX <= this.width + 45) {
      return this.drawRightSlider(positionX - this.streetOffset/2);
    }
  };

  drawLeftSlider(x: number, init: boolean = false): this {
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


      this.leftScrollOpacityLabels
        .append('rect')
        .attr('class', 'left-scroll-opacity-part2')
        .attr('x', 0)
        .attr('y', 50)
        .attr('height', 15)
        .style('fill', 'white')
        .attr('width', () => {
          const width = x + this.halfOfStreetOffset;

          return width > 0 ? width : 0;
        })
        .style('opacity', '0.8');
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
        .on('touchstart', () => this.sliderLeftMove = true, { passive: true });
    }

    this.leftScroll
      .attr('x',  x > 0 ? x : 0);

    this.leftScrollOpacityStreet
      .attr('width', () => {
        const width = x + this.halfOfStreetOffset ;

        return  width > 0 ? width : 0;
      });
    this.leftScrollOpacityHomes
      .attr('width', () => {
        const width = x + this.halfOfStreetOffset ;

        return  width > 0 ? width : 0;
      });

    this.lowIncome = this.scale.invert(x);

    if (init) {
      return this;
    }

    this.drawScrollLabel();

    return this;
  };

  drawRightSlider(x: number): this {
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
        .on('touchstart', () => this.sliderRightMove = true, { passive: true });
    }

    this.rightScroll
      .attr('x',  x);

    this.rightScrollOpacityStreet.attr('x', x + this.halfOfStreetOffset)
      .attr('width', this.width + this.halfOfStreetOffset );
    this.rightScrollOpacityHomes.attr('x', x + this.halfOfStreetOffset )
      .attr('width', this.width + this.halfOfStreetOffset );
    this.highIncome = this.scale.invert(x);

    this.drawScrollLabel();

    return this;
  };

  clearSvg(): this {
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

  getDividersGaps(divider: number, dividersSpace = SVG_DEFAULTS.sliders.gaps ): DividersGaps {
    const coordsDivider = this.scale(divider);
    
    const dividerGaps = {
      from: (coordsDivider - dividersSpace),
      to: (coordsDivider + dividersSpace),
    }

    return dividerGaps;
  }

  dividerFallWithinGaps(dividerPosition: number, dividersGap: DividersGaps): boolean {
    let fall = false;
    if ((dividerPosition >= dividersGap.from) && (dividerPosition <= dividersGap.to)) {
      fall = true;
    }

    return fall;
  }

  drawScrollLabel(): this {
    const poorGaps = this.getDividersGaps(this.dividersData.poor);
    const richGaps = this.getDividersGaps(this.dividersData.rich)

    const lowGaps = this.getDividersGaps(this.dividersData.low);
    const mediumGaps = this.getDividersGaps(this.dividersData.medium);
    const hightGaps = this.getDividersGaps(this.dividersData.high);

    let incomeL = Math.round(this.lowIncome ? this.lowIncome : 0);
    let incomeR = Math.round(this.highIncome ? this.highIncome : this.dividersData.rich);

    if (incomeR > this.dividersData.rich) {
      incomeR = this.dividersData.rich;
    }

    let xL = this.scale(incomeL);
    let xR = this.scale(incomeR);

    if (this.dividerFallWithinGaps(xL, lowGaps) || this.dividerFallWithinGaps(xR, lowGaps)) {
      this.svg.selectAll('text.scale-label' + this.dividersData.low).attr('fill', SVG_DEFAULTS.levels.colorToHide);
    } else {
      this.svg.selectAll('text.scale-label' + this.dividersData.low).attr('fill', SVG_DEFAULTS.levels.color);
    }

    if (this.dividerFallWithinGaps(xL, mediumGaps) || this.dividerFallWithinGaps(xR, mediumGaps)) {
      this.svg.selectAll('text.scale-label' + this.dividersData.medium).attr('fill', SVG_DEFAULTS.levels.colorToHide);
    } else {
      this.svg.selectAll('text.scale-label' + this.dividersData.medium).attr('fill', SVG_DEFAULTS.levels.color);
    }

    if (this.dividerFallWithinGaps(xL, hightGaps) || this.dividerFallWithinGaps(xR, hightGaps)) {
      this.svg.selectAll('text.scale-label' + this.dividersData.high).attr('fill', SVG_DEFAULTS.levels.colorToHide);
    } else {
      this.svg.selectAll('text.scale-label' + this.dividersData.high).attr('fill', SVG_DEFAULTS.levels.color);
    }

    if ((this.dividerFallWithinGaps(xL, poorGaps)) || (this.dividerFallWithinGaps(xR, poorGaps))) {
      this.svg.selectAll('text.poorest').attr('fill', SVG_DEFAULTS.levels.colorToHide);
    } else {
      this.svg.selectAll('text.poorest').attr('fill', SVG_DEFAULTS.levels.color);
    }

    if ((this.dividerFallWithinGaps(xL, richGaps)) || (this.dividerFallWithinGaps(xR, richGaps))) {
      this.svg.selectAll('text.richest').attr('fill', SVG_DEFAULTS.levels.colorToHide);
    } else {
      this.svg.selectAll('text.richest').attr('fill', SVG_DEFAULTS.levels.color);
    }

    incomeL = Number(this.math.roundIncome(incomeL * this.currencyUnit.value));
    incomeR = Number(this.math.roundIncome(incomeR * this.currencyUnit.value));

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

    const leftScrollTextStyle: {width; height;} = this.leftScrollText.node().getBBox();
    const rightScrollTextStyle: {width; height;} = this.rightScrollText.node().getBBox();

    const leftScrollTextWidth: number = parseInt(leftScrollTextStyle.width, 10);
    const rightScrollTextWidth: number = parseInt(rightScrollTextStyle.width, 10);

    this.leftScrollText
      .text(`${this.currencyUnit.symbol}${incomeL}`)
      .attr('x', ()=> {
        const positionX = xL + this.halfOfStreetOffset - 5.5 - leftScrollTextWidth / 2;
        return positionX > 0 ? positionX : 0;
      });

    this.rightScrollText
      .text(`${this.currencyUnit.symbol}${incomeR}`)
      .attr('x', ()=> xR + this.halfOfStreetOffset + 5.5 - rightScrollTextWidth / 2);
    return this;
  };
}
