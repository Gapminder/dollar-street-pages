import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import {
  MathService,
  BrowserDetectionService
} from '../../common';
import { scaleLog } from 'd3-scale';
import { axisBottom } from 'd3-axis';
import { select } from 'd3-selection';

import * as _ from 'lodash';
import { SVG_DEFAULTS } from './svg-parameters';
import {
  AppStates,
  DrawDividersInterface,
  Place,
  DividersGaps, Currency, TimeUnit
} from '../../interfaces';
import {
  DefaultUrlParameters,
  MOBILE_SIZE
} from '../../defaultState';
import { Store } from '@ngrx/store';
import * as MatrixActions from '../../matrix/ngrx/matrix.actions';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class StreetDrawService {
  width: number;
  height: number;
  halfOfHeight: number;
  lowIncome: number;
  highIncome: number;
  streetOffset = 60;
  chosenPlaces: Place[];
  poorest: string;
  richest: string;
  scale;
  axisLabel: number[] = [];
  levelLabels: string[] = [];
  svg;
  incomeArr: any[] = [];
  mouseMoveSubscriber: Subscription;
  mouseLeaveSubscriptrion: Subscription;
  dividersData: DrawDividersInterface;
  mouseUpSubscriber;
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
  leftPoint;
  rightPoint;
  leftScrollOpacityStreet;
  leftScrollOpacityLabels;
  leftScrollOpacityHomes;
  rightScrollOpacityStreet;
  rightScrollOpacityLabels;
  rightScrollOpacityHomes;
  leftScrollText;
  rightScrollText;
  hoverPlace;
  minIncome;
  maxIncome;
  regions: string[] | string;
  thingname: string;
  countries: string[] | string;
  placesArray: Place[] = [];
  currentLowIncome: number;
  currentHighIncome: number;
  filter: Subject<any> = new Subject<any>();
  windowInnerWidth: number = window.innerWidth;
  isDesktop: boolean;
  isMobile: boolean;
  currencyUnit: Currency;
  timeUnit: TimeUnit;

  colors = {
    fills: {
      Europe: '#FFE800',
      Africa: '#15B0D1',
      'The Americas': '#B1E826',
      Asia: '#F23373'
    },
    fillsOfBorders: {
      Europe: '#dbc700',
      Africa: '#119ab7',
      'The Americas': '#96c61d',
      Asia: '#bc1950'
    }
  };

  constructor(private math: MathService,
                     browserDetectionService: BrowserDetectionService,
                     private store: Store<AppStates>) {
    this.isDesktop = browserDetectionService.isDesktop();
    this.isMobile = browserDetectionService.isMobile();
  }

  init(lowIncome: number, highIncome: number, drawDividers: DrawDividersInterface, regions: string[], countries: string[], thing: string): this {

    this.thingname = thing;
    this.countries = countries[0];
    this.regions = regions[0];
    this.axisLabel = drawDividers.dividers;
    this.levelLabels = [
      _.get(drawDividers, 'firstLabelName', ''),
      _.get(drawDividers, 'secondLabelName', ''),
      _.get(drawDividers, 'thirdLabelName', ''),
      _.get(drawDividers, 'fourthLabelName', '')
    ]
    this.dividersData = drawDividers;
    this.minIncome = drawDividers.poor;
    this.maxIncome = drawDividers.rich;
    this.lowIncome = lowIncome || _.get(drawDividers, 'poor', 0);
    this.highIncome = highIncome || _.get(drawDividers, 'rich', 0);

    this.calculateSvgSize();


    this.scale = scaleLog()
      .domain([
        _.get(drawDividers, 'poor', Number(DefaultUrlParameters.lowIncome)),
        _.get(drawDividers, 'rich', Number(DefaultUrlParameters.highIncome))
      ])
      .range([0, this.width]);

    return this;
  }

  calculateSvgSize(): void {
    const svgHeight = this.svg.style('height').length ? this.svg.style('height') : 0;
    const svgWidth = this.svg.style('width').length ? this.svg.style('width') : 0;

    this.width = parseInt(svgWidth, 10) - this.streetOffset;
    this.height = parseInt(svgHeight, 10);

    this.halfOfHeight = 0.5 * this.height;
    this.windowInnerWidth = window.innerWidth;
  }

  set setSvg(element: HTMLElement) {
    this.svg = select(element);
  }

  set(key: any, val: any): this {
    this[key] = val;

    return this;
  };

  isDrawDividers(drawDividers: DrawDividersInterface): this {
    if (!_.get(drawDividers, 'showDividers', false) /*|| !this.showStreetAttrs*/) {
      return;
    }

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
        const x = this.scale(d) - SVG_DEFAULTS.squarePoints.width/2 + this.streetOffset/2;

        return x;
      });

    return this;
  }

  isDrawCurrency(drawDividers: DrawDividersInterface): this {
    if (!_.get(drawDividers, 'showCurrency', false) /*|| !this.showStreetAttrs*/) {
      return;
    }
    const factorTimeUnit = this.factorTimeUnit(this.timeUnit.per);

    this.svg
      .selectAll('text.scale-label')
      .data(this.axisLabel)
      .enter()
      .append('text')
      .attr('class', 'currency-text')
      .attr('text-anchor', 'middle')
      .text((d: any) => {

        return `${this.currencyUnit.symbol}${this.math.roundIncome(d * this.currencyUnit.value * factorTimeUnit)}`;
      })
      .attr('x', (d: any) => {

        return this.scale(d) + this.streetOffset/2;
      })
      .attr('class', (d: any) => {
        return `currency-text scale-label${d}`;
      })
      .attr('y', SVG_DEFAULTS.levels.positionY)
      .attr('fill', SVG_DEFAULTS.levels.color);

    return this;
  }

  isDrawLabels(drawDividers: DrawDividersInterface): this {
    if (!_.get(drawDividers, 'showLabels', false) /*|| !this.showStreetAttrs*/) {
      return;
    }

    const data = this.levelLabels.map((curr, ind) => {
      const from = ind === 0 ? drawDividers.poor : this.axisLabel[ind - 1];
      const to = ind === this.levelLabels.length - 1 ? drawDividers.rich : this.axisLabel[ind];

      return {from, to, name: curr};
    });
    this.svg
      .selectAll('text.scale-label')
      .data(data)
      .enter()
      .append('text')
      .text((d, index) => {
        let text = '';
        if (this.isDesktop) {
          text = d.name;
        } else {
          text = `Ls${index + 1}`;
        }

        return text;
      })
      .attr('x', (d: any) => {
        let pos = (this.scale(d.to) - this.scale(d.from)) / 2 + this.scale(d.from);

        return pos;
      })
      .attr('y', SVG_DEFAULTS.levels.positionY)
      .attr('fill', SVG_DEFAULTS.levels.color)
      .attr('class', 'scale-label level-label');

    return this;
  }

  onMouseEvent(e: MouseEvent | Touch) {
    if (this.windowInnerWidth < SVG_DEFAULTS.mobileWidth
      || (!this.sliderLeftMove && !this.sliderRightMove && !this.draggingSliders)) {
      return;
    }

    if (!this.currentHighIncome || !this.currentLowIncome) {
      this.currentLowIncome = this.lowIncome;
      this.currentHighIncome = this.highIncome;
    }

    if (this.draggingSliders && !this.sliderLeftMove && !this.sliderRightMove) {
      document.body.classList.add('draggingSliders');
      if (!this.distanceDraggingLeftSlider) {
        this.distanceDraggingLeftSlider = e.pageX - 45 - this.sliderLeftBorder;
      }

      if (!this.distanceDraggingRightSlider) {
        this.distanceDraggingRightSlider = this.sliderRightBorder - (e.pageX - 56);
      }


      if ((this.thingname !== 'Families' || this.countries !== 'World' || this.regions !== 'World') && !this.isMobile) {
        if (e.pageX - this.distanceDraggingLeftSlider >= this.leftPoint + 40 && e.pageX + this.distanceDraggingRightSlider <= this.rightPoint + 76) {
          this.chosenPlaces = [];
          this.removeHouses('chosen');
          this.drawLeftSlider(e.pageX - 57 - this.distanceDraggingLeftSlider);
          this.drawRightSlider(e.pageX - 57 + this.distanceDraggingRightSlider);
        }
      } else {
        if (e.pageX - this.distanceDraggingLeftSlider >= 50 &&
          e.pageX + this.distanceDraggingRightSlider <= this.width + 60) {
          this.chosenPlaces = [];
          this.removeHouses('chosen');
          this.drawLeftSlider(e.pageX - 47 - this.distanceDraggingLeftSlider);
          this.drawRightSlider(e.pageX - 57 + this.distanceDraggingRightSlider);
        }
      }

      return;
    }

    if (this.sliderLeftMove && e.pageX <= this.sliderRightBorder - SVG_DEFAULTS.minSliderSpace) {
      let position;
      if (e.pageX > 0) {
        position = e.pageX - (this.windowInnerWidth - this.width) / 2;
      } else {
        position = 0;
      }

      return this.drawLeftSlider(position);
    }

    if (this.sliderRightMove && e.pageX >= this.sliderLeftBorder + SVG_DEFAULTS.minSliderSpace) {
      let position;
      if (e.pageX <= this.width + (this.windowInnerWidth - this.width) / 2  ) {
        position = e.pageX - (this.windowInnerWidth - this.width) / 2
      } else {
        position = this.width;
      }

      return this.drawRightSlider(position);
    }

  }

  drawScale(places: Place[], drawDividers: DrawDividersInterface, factorTimeUnit = 1): this {

    axisBottom(this.scale)
      .tickFormat(() => {
        return void 0;
      });

    this.svg
      .selectAll('text.poorest')
      .data([this.poorest])
      .enter()
      .append('text')
      .attr('class', 'poorest')
      .text(this.poorest)
      .attr('x', 0)
      .attr('y', SVG_DEFAULTS.levels.positionY)
      .attr('fill', SVG_DEFAULTS.levels.color);

    this.svg
      .selectAll('text.richest')
      .data([this.richest])
      .enter()
      .append('text')
      .attr('class', 'richest')
      .text(this.richest)
      .attr('y', SVG_DEFAULTS.levels.positionY)
      .attr('fill', SVG_DEFAULTS.levels.color);

    const svgElement: any = document.getElementById('chart');
    const svgElementNodes: any = svgElement.childNodes;
    let richestWidth = svgElementNodes[1].getBBox().width;

    richestWidth = !isNaN(richestWidth) ? richestWidth : 54;

    this.svg
      .selectAll('text.richest')
      .attr('x', this.width + this.streetOffset - richestWidth);

    if (places && places.length) {

      const sortedPlaces = _
        .chain(places)
        .uniqBy('_id')
        .sortBy('income')
        .value();
      this.placesArray = sortedPlaces;

      // if ((this.thingname !== 'Families' || this.countries !== 'World' || this.regions !== 'World') && !this.isMobile) {
      //   const minPlacesIncome = _.head(this.placesArray).income;
      //   const maxPlacesIncome = _.last(this.placesArray).income;
      //   this.minIncome = minPlacesIncome < this.lowIncome ? minPlacesIncome : this.lowIncome;
      //   this.maxIncome = maxPlacesIncome > this.highIncome ? maxPlacesIncome : this.highIncome;
      // } else {
        this.minIncome = drawDividers.poor;
        this.maxIncome = drawDividers.rich;
      // }

      this.leftPoint = this.scale(this.minIncome) - SVG_DEFAULTS.sliders.moreThenNeed;
      this.rightPoint = this.scale(this.maxIncome) + SVG_DEFAULTS.sliders.moreThenNeed;


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
          const position = scaleDatumIncome + this.streetOffset / 2 - SVG_DEFAULTS.backgroungHomes.width / 2 ;

          return position;
        });
    };

    this.svg
      .append('polygon')
      .attr('class', 'road')
      .attr('height', SVG_DEFAULTS.road.height)
      .attr('points', () => {
        const point1 = `0,${ this.halfOfHeight + 11}`;
        const point2 = `30,${ this.halfOfHeight - 4}`;
        const point3 = `${ this.width + this.streetOffset - this.streetOffset / 2},${ this.halfOfHeight - 4}`;
        const point4 = `${ this.width + this.streetOffset},${ this.halfOfHeight + 11}`;

        return `${point1} ${point2} ${point3} ${point4}`;
      })
      .style('fill', SVG_DEFAULTS.road.background)
      .style('cursor', '-webkit-grab')
      .style('cursor', '-moz-grab')
      .style('cursor', 'grab')
      .on('mousedown', (): void => {
        this.draggingSliders = true;
      })
      .on('touchstart', () => this.draggingSliders = true, {passive: true});

    this.svg
      .append('line')
      .attr('class', 'axis')
      .attr('height', SVG_DEFAULTS.road.line.height)
      .attr('x1', 1)
      .attr('y1', this.halfOfHeight + 11.5)
      .attr('x2', this.width + this.streetOffset - 1)
      .attr('y2', this.halfOfHeight + 11.5)
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
      .on('touchstart', (): any => this.draggingSliders = true, { passive: true });

    this.incomeArr.length = 0;

    this.isDrawDividers(drawDividers);
    this.isDrawCurrency(drawDividers);
    this.isDrawLabels(drawDividers);


    if (!places || !places.length) {
      return this;
    }

    this.drawLeftSlider(this.scale(this.lowIncome), true);
    this.drawRightSlider(this.scale(this.highIncome), true);

    if (this.mouseLeaveSubscriptrion) {
      this.mouseLeaveSubscriptrion.unsubscribe();
    }

    if (this.mouseMoveSubscriber) {
      this.mouseMoveSubscriber.unsubscribe();
    }

    this.mouseLeaveSubscriptrion = fromEvent(document, 'mouseleave', {passive: true})
      .subscribe((e: MouseEvent) => {
        this.onMouseEvent(e);
      });

    this.mouseMoveSubscriber = fromEvent(window, 'mousemove', { passive: true })
      .subscribe((e: MouseEvent) => {
        this.onMouseEvent(e);
      });

    if (this.touchMoveSubscriber) {
      this.touchMoveSubscriber.unsubscribe();
    }

    this.touchMoveSubscriber = fromEvent(window, 'touchmove', { passive: true })
      .subscribe((e: TouchEvent) => {
        this.onMouseEvent(e.touches[0]);
        }
      );

    this.mouseUpSubscriber = fromEvent(window, 'mouseup' , { passive: true })
      .subscribe(() => {

        if (this.windowInnerWidth < MOBILE_SIZE || (!this.sliderLeftMove && !this.sliderRightMove && !this.draggingSliders)) {
          return;
        }

        this.pressedSlider();
      });

    this.touchUpSubscriber = fromEvent(window, 'touchend', { passive: true })
      .subscribe(() => {
        if (this.windowInnerWidth < MOBILE_SIZE || (!this.sliderLeftMove && !this.sliderRightMove && !this.draggingSliders)) {
          return;
        }

        this.pressedSlider();
      });

    return this;
  }

  drawHoverHouse( place, gray = false) {
    if (!place) {
      this.removeHouses('hover')

      return this;
    }

    this.removeSliders();

    this.svg
      .selectAll('use.icon-hover-home')
      .data([place])
      .enter()
      .append('use')
      .attr('class', 'icon-hover-home')
      .attr('class', 'hover')
      .attr('y', SVG_DEFAULTS.hoverHomes.positionY)
      .attr('width', SVG_DEFAULTS.hoverHomes.width)
      .attr('height', SVG_DEFAULTS.hoverHomes.height)
      .attr('fill', SVG_DEFAULTS.hoverHomes.fill)
      .attr('xlink:href', SVG_DEFAULTS.hoverHomes.name)
      .attr('income', (datum: Place) => { return datum.income; })
      .attr('home-id', (datum: Place) => { return datum._id; })
      .attr('x', (datum: Place) => {
        const scaleDatumIncome = this.scale(datum.income);
        const position = (this.streetOffset / 2) + scaleDatumIncome - SVG_DEFAULTS.hoverHomes.differenceSizeHover;

        return position;
      });

    this.drawLeftSlider(this.scale(this.lowIncome), true);
    this.drawRightSlider(this.scale(this.highIncome), true);

    // this.svg
    //   .selectAll('use.hover-bg')
    //   .data([place])
    //   .enter()
    //   .append('use')

    this.svg
      .selectAll('rect.hover-bg')
      .data([place])
      .enter()
      .append('rect')
      .attr('rx', 3)
      .attr('ry', 3)
      .attr('class', 'hover-bg')
      // .attr('xlink:href', SVG_DEFAULTS.hoverHomes.textBg.name)
      .attr('width', (datum: Place) => {

        const widthBySymbol = datum.showIncome.toString().length * SVG_DEFAULTS.hoverHomes.textBg.widthBySymbol;
        const maxWidth = SVG_DEFAULTS.hoverHomes.textBg.width;
        if (widthBySymbol < maxWidth) {
          return widthBySymbol;
        }

        return maxWidth;
      })
      .attr('height', SVG_DEFAULTS.hoverHomes.textBg.height)
      .attr('y', SVG_DEFAULTS.hoverHomes.textBg.positionY)
      .attr('fill', SVG_DEFAULTS.hoverHomes.textBg.fill)
      .attr('stroke', SVG_DEFAULTS.hoverHomes.textBg.stroke)
      .attr('stroke-width', SVG_DEFAULTS.hoverHomes.textBg.strokeWidth)
      .attr('x', ( datum: Place ) => {
        let width = 0;
        const widthBySymbol = datum.showIncome.toString().length * SVG_DEFAULTS.hoverHomes.textBg.widthBySymbol;
        const maxWidth = SVG_DEFAULTS.hoverHomes.textBg.width;
        if (widthBySymbol < maxWidth) {
          width = widthBySymbol;
        } else {
          width = maxWidth
        }

        const scaleDatumIncome = this.scale(datum.income);
        const position = (this.streetOffset / 2) + scaleDatumIncome - width / 2 ;

        return position;
      })


    this.svg
      .selectAll('text.hover-house-text')
      .data([place])
      .enter()
      .append('text')
      .attr('class', 'hover-house-text')
      .attr('y', SVG_DEFAULTS.hoverHomes.text.positionY)
      .attr('fill', SVG_DEFAULTS.hoverHomes.text.fill)
      .attr('style', SVG_DEFAULTS.hoverHomes.text.styles)
      .attr('text-anchor', 'middle')
      .attr('x', (home: Place) => {
        const x = this.scale(home.income) + (this.streetOffset / 2);

        return x;
      })
      .text(( home: Place ) => {
        const text = `${this.currencyUnit.symbol ? this.currencyUnit.symbol: ''}${home.showIncome ? home.showIncome : ''}`;

        return text;
      });

    return this;
  };

  drawLeftSlider(x: number, init: boolean = false): this {
    if (this.windowInnerWidth <= SVG_DEFAULTS.mobileWidth && Math.round(this.lowIncome) === this.dividersData.poor) {
      return;
    }

    this.sliderLeftBorder = x + (this.windowInnerWidth - this.width) / 2;

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
        .attr('x', 0)
        .attr('y', SVG_DEFAULTS.road.positionY)
        .attr('height', SVG_DEFAULTS.road.overlay.height)
        .style('fill', 'white')
        .style('opacity', '0.8');
    }

    if (!this.leftScrollOpacityLabels) {
      this.leftScrollOpacityLabels = this.svg;

      const width = (x + this.streetOffset ) > 0 ? x + this.streetOffset : 0;

      if (x < this.streetOffset + SVG_DEFAULTS.sliders.moreThenNeed) {

        this.leftScrollOpacityLabels
          .append('rect')
          .attr('class', 'left-scroll-opacity-labels')
          .attr('x', 0)
          .attr('y', 50)
          .attr('height', 15)
          .style('fill', 'white')
          .attr('width', width)
          .style('opacity', '0.1');
      } else {
        this.leftScrollOpacityLabels
          .append('rect')
          .attr('class', 'left-scroll-opacity-labels')
          .attr('x', 0)
          .attr('y', 50)
          .attr('height', 15)
          .style('fill', 'white')
          .attr('width', width)
          .style('opacity', '0.6');
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
        .attr('style', 'cursor: pointer ')
        .on('mousedown', (): void => {
          this.sliderLeftMove = true;
        })
        .on('touchstart', (): any => this.sliderLeftMove = true);
    }

    this.leftScroll
      .attr('x',  () => {
        // if (this.leftPoint >= x) {
        //   return this.leftPoint + SVG_DEFAULTS.sliders.differentSize;
        // } else {
          const position = (x < 0 ? 0 : x) + SVG_DEFAULTS.sliders.differentSize;

          return position;
        // }
      });

    // if ((this.thingname !== 'Families' || this.countries !== 'World' || this.regions !== 'World') && !this.isMobile) {
    //   this.leftScrollOpacityStreet
    //     .attr('width', (x < 0 ? 0 : x) + this.streetOffset);
    //   this.leftScrollOpacityHomes
    //     .attr('width', (x < 0 ? 0 : x) + this.streetOffset / 2);
    // } else {
      this.leftScrollOpacityStreet
        .attr('width', (x < 0 ? 0 : x) + this.streetOffset / 2);
      this.leftScrollOpacityHomes
        .attr('width', (x < 0 ? 0 : x) + this.streetOffset / 2 - SVG_DEFAULTS.sliders.moreThenNeed / 2);
    // }

    this.lowIncome = this.scale.invert(x);

    if (init) {
      return this;
    }

    this.drawScrollLabel();

    return this;
  };

  drawRightSlider(x: number, init: boolean = false): this {
    if (this.windowInnerWidth <= SVG_DEFAULTS.mobileWidth && Math.round(this.highIncome) === this.dividersData.rich) {
      return;
    }

    this.sliderRightBorder = x + (this.windowInnerWidth - this.width) / 2;

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
        .attr('class', 'right-scroll-opacity-part-street')
        .attr('x', -2)
        .attr('y', SVG_DEFAULTS.road.positionY)
        .attr('height', SVG_DEFAULTS.road.overlay.height)
        .style('fill', SVG_DEFAULTS.road.color)
        .style('opacity', SVG_DEFAULTS.road.opacity);
    }

    if (!this.rightScrollOpacityLabels) {
      this.rightScrollOpacityLabels = this.svg;

      if (x > this.width - SVG_DEFAULTS.sliders.moreThenNeed) {
        const width = (this.width - x + this.streetOffset) > 0 ? this.width - x + this.streetOffset : 0;
        this.rightScrollOpacityLabels
          .append('rect')
          .attr('class', 'right-scroll-opacity-labels')
          .attr('x', x)
          .attr('y', 50)
          .attr('height', 15)
          .style('fill', 'white')
          .attr('width', width)
          .style('opacity', '0.1');
      } else {
        this.rightScrollOpacityLabels
          .append('rect')
          .attr('class', 'right-scroll-opacity-labels')
          .attr('x', x )
          .attr('y', 50)
          .attr('height', 15)
          .style('fill', 'white')
          .attr('width', () => {
            const width = this.width - x + this.streetOffset;

            return width > 0 ? width : 0;
          })
          .style('opacity', '0.65');
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
        .attr('style', 'cursor: pointer')
        .on('mousedown', (): void => {
          this.sliderRightMove = true;
        })
        .on('touchstart', (): any => this.sliderRightMove = true);
    }

    this.rightScroll
      .attr('x',  () => {
        if (this.rightPoint <= x ) {
          return this.rightPoint + SVG_DEFAULTS.sliders.differentSize;
        } else {
          const position = x + SVG_DEFAULTS.sliders.differentSize;

          return position;
        }
      });

    if (this.thingname !== 'Families' || this.countries !== 'World' || this.regions !== 'World' && !this.isMobile) {
      if (Math.round(this.rightPoint + this.streetOffset / 2) < Math.round(x + this.streetOffset / 2 - 1) && !this.isMobile) {
        this.sliderRightBorder = this.rightPoint + 12;

        this.rightScrollOpacityStreet
          .attr('x', this.rightPoint + this.streetOffset / 2 )
          .attr('width', this.width + this.streetOffset / 2);
        this.rightScrollOpacityHomes
          .attr('x', this.rightPoint + this.streetOffset / 2 )
          .attr('width', this.width + this.streetOffset / 2);
      } else {
        this.rightScrollOpacityStreet
          .attr('x', x + this.streetOffset / 2)
          .attr('width', this.width + this.streetOffset / 2 - x);
        this.rightScrollOpacityHomes
          .attr('x', x + this.streetOffset / 2 + 1.5)
          .attr('width', this.width + this.streetOffset / 2 - x);
      }
    } else {
      const width = (this.width + this.streetOffset / 2 - x) > 0 ? this.width + this.streetOffset / 2 - x : 0;
      this.rightScrollOpacityStreet.attr('x', x + this.streetOffset / 2 )
        .attr('width', width);
      this.rightScrollOpacityHomes.attr('x', x + this.streetOffset / 2)
        .attr('width', width);
    }

    this.highIncome = this.scale.invert(x);

    if (init) {
      return this;
    }

    this.drawScrollLabel();

    return this;
  };

  clearAndRedraw(places?): this {
    this.removeHouses('hover');
    this.removeHouses('chosen');

    if (!places || !places.length) {

      return this;
    }

    this.removeSliders();

    this.drawHouses(places);

    this.drawHoverHouse(this.hoverPlace);

    this.drawLeftSlider(this.scale(this.lowIncome), true);
    this.drawRightSlider(this.scale(this.highIncome), true);

    return this;
  };

  removeHouses(selector: any): this {
    this.svg.selectAll('rect.' + selector).remove();
    this.svg.selectAll('polygon.' + selector).remove();
    this.svg.selectAll('use.' + selector).remove();
    this.svg.selectAll('use#' + selector).remove();

    if (selector === 'chosen') {
      this.svg.selectAll('polygon.chosenLine').remove();
      this.svg.selectAll('use.icon-active-homes').remove();
    }

    if (selector === 'hover') {
      this.svg.selectAll('text.hover-house-text').remove();
      this.svg.selectAll('rect.hover-bg').remove();
    }

    return this;
  };

  removeSliders(): this {
    this.svg.selectAll('use#right-scroll').remove();
    this.svg.selectAll('use#left-scroll').remove();
    this.leftScroll = false;
    this.rightScroll = false;
    return this;
  };

  clearSvg(): this {
    this.leftScroll = void 0;
    this.rightScroll = void 0;
    this.leftScrollOpacityStreet = void 0;
    this.leftScrollOpacityHomes = void 0;
    this.leftScrollOpacityLabels = void 0;
    this.rightScrollOpacityLabels = void 0;
    this.rightScrollOpacityStreet = void 0;
    this.rightScrollOpacityHomes = void 0;
    this.leftScrollText = void 0;
    this.rightScrollText = void 0;

    this.svg.selectAll('*').remove();

    return this;
  };

  drawScrollLabel(): this {
    const poorGaps = this.getDividersGaps(this.dividersData.poor);
    const richGaps = this.getDividersGaps(this.dividersData.rich)

    const lowGaps = this.getDividersGaps(this.dividersData.low);
    const mediumGaps = this.getDividersGaps(this.dividersData.medium);
    const hightGaps = this.getDividersGaps(this.dividersData.high);

    let incomeL = Math.round(+this.lowIncome ? +this.lowIncome : 0);
    let incomeR = Math.round(+this.highIncome ? +this.highIncome : +this.dividersData.rich);

    if (incomeR > +this.dividersData.rich) {
      incomeR = +this.dividersData.rich;
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

    incomeL = +this.math.roundIncome(incomeL * Number(this.currencyUnit.value));
    incomeR = +this.math.roundIncome(incomeR * Number(this.currencyUnit.value));

    if (!this.leftScrollText) {
      this.leftScrollText = this.svg
        .append('text')
        .attr('class', 'left-scroll-label')
        .text(`${this.currencyUnit.symbol}${incomeL * this.currencyUnit.value}`)
        .attr('y', this.height - 2)
        .attr('fill', SVG_DEFAULTS.levels.color);
    }

    if (!this.rightScrollText) {
      this.rightScrollText = this.svg
        .append('text')
        .attr('class', 'right-scroll-label')
        .text(`${this.currencyUnit.symbol}${incomeR * this.currencyUnit.value}`)
        .attr('y', this.height - 2)
        .attr('fill', SVG_DEFAULTS.levels.color);
    }

    const leftScrollTextStyle: {width: any; height: any;} = this.leftScrollText.node().getBBox();
    const rightScrollTextStyle: {width: any; height: any;} = this.rightScrollText.node().getBBox();

    const leftScrollTextWidth = parseInt(leftScrollTextStyle.width, 10);
    const rightScrollTextWidth = parseInt(rightScrollTextStyle.width, 10);

    if (Math.round(this.leftPoint + this.streetOffset / 2) > Math.round(xL + this.streetOffset / 2 + 4) &&
    (this.thingname !== 'Families' || this.countries !== 'World' || this.regions !== 'World') && !this.isMobile) {

      incomeL = Math.round(this.minIncome * this.currencyUnit.value);
      incomeL = +this.math.roundIncome(incomeL);

      this.leftScrollText
        .text(`${this.currencyUnit.symbol}${incomeL}`)
        .attr('x', () => this.leftPoint + this.streetOffset / 2 - 4.5 - leftScrollTextWidth / 2);
    } else {
      this.leftScrollText
        .text(`${this.currencyUnit.symbol}${incomeL}`)
        .attr('x', () => xL + this.streetOffset / 2 - 4.5 - leftScrollTextWidth / 2);
    }

    if (Math.round(this.rightPoint + this.streetOffset / 2) < Math.round(xR + this.streetOffset / 2 - 1) &&
    (this.thingname !== 'Families' || this.countries !== 'World' || this.regions !== 'World') && !this.isMobile) {

      incomeR = Math.round(this.maxIncome * this.currencyUnit.value);
      incomeR = +this.math.roundIncome(incomeR);

      this.rightScrollText
        .text(`${this.currencyUnit.symbol}${incomeR}`)
        .attr('x', () => this.rightPoint + this.streetOffset / 2 + 4.5 - rightScrollTextWidth / 2);
    } else {
      this.rightScrollText
        .text(`${this.currencyUnit.symbol}${incomeR}`)
        .attr('x', () => xR + this.streetOffset / 2 + 4.5 - rightScrollTextWidth / 2);
    }

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

  drawHouses(places: Place[]): this {
    this.placesArray = [];

    if (!places || !places.length) {
      return this;
    }

    const drawnPlaces = this.svg
      .selectAll('use.icon-active-homes')
      .data(places)
      .enter()
      .append('use')
      .attr('class', 'icon-active-homes')
      .attr('class', 'chosen')
      .attr('y', SVG_DEFAULTS.activeHomes.positionY)
      .attr('width', SVG_DEFAULTS.activeHomes.width)
      .attr('height', SVG_DEFAULTS.activeHomes.height)
      .attr('fill', SVG_DEFAULTS.activeHomes.fill)
      .attr('xlink:href', SVG_DEFAULTS.activeHomes.name)
      .attr('income', (datum: Place) => { return datum.income})
      .attr('home-id', (datum: Place) => { return datum._id})
      .attr('x', (datum: Place) => {

        const scaleDatumIncome = this.scale(datum.income);
        const position = scaleDatumIncome + this.streetOffset / 2 - SVG_DEFAULTS.activeHomes.width / 2 ;

        return position;
      });

    return this;
  };

  pressedSlider(): void {
    document.body.classList.remove('draggingSliders');
    this.store.dispatch(new MatrixActions.RemovePlace({}));
    if (this.draggingSliders && !this.distanceDraggingLeftSlider && !this.distanceDraggingRightSlider) {
      this.draggingSliders = false;
      this.distanceDraggingLeftSlider = void 0;
      this.distanceDraggingRightSlider = void 0;

      if (this.leftScrollText || this.rightScrollText) {
        this.leftScrollText.text('');
        this.rightScrollText.text('');
      }

      return;
    }

    if (this.sliderLeftMove && (!this.currentLowIncome || this.currentLowIncome === this.lowIncome)) {
      this.sliderLeftMove = false;
      this.currentLowIncome = void 0;
      this.currentHighIncome = void 0;

      if (this.leftScrollText || this.rightScrollText) {
        this.leftScrollText.text('');
        this.rightScrollText.text('');
      }

      return;
    }

    if (this.sliderRightMove && (!this.currentHighIncome || this.currentHighIncome === this.highIncome)) {
      this.sliderRightMove = false;
      this.currentLowIncome = void 0;
      this.currentHighIncome = void 0;

      if (this.leftScrollText || this.rightScrollText) {
        this.leftScrollText.text('');
        this.rightScrollText.text('');
      }

      return;
    }

    this.draggingSliders = this.sliderLeftMove = this.sliderRightMove = false;
    this.distanceDraggingLeftSlider = void 0;
    this.distanceDraggingRightSlider = void 0;
    this.currentLowIncome = void 0;
    this.currentHighIncome = void 0;

    if (this.highIncome > this.dividersData.rich) {
      this.highIncome = this.dividersData.rich;
    }
    let lowFilter = Math.round(this.lowIncome);
    let highFilter = Math.round(this.highIncome);

      if ((this.lowIncome - 1) <= this.minIncome) {
        lowFilter = Math.round(this.minIncome - SVG_DEFAULTS.sliders.moreThenNeed);
      }

      if (this.highIncome + 1 >= this.maxIncome) {
        highFilter = Math.round(this.maxIncome + SVG_DEFAULTS.sliders.moreThenNeed);
      }
    this.filter.next({
      lowIncome: lowFilter,
      highIncome: highFilter
    });

  }

  factorTimeUnit(unitCode: string): number {
    return SVG_DEFAULTS.factorTimeUnits[unitCode];
  }
}

