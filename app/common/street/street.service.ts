import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { MathService } from '../math-service/math-service';
import { DrawDividersInterface } from './street.settings.service';
import * as _ from 'lodash';

const d3 = require('d3');

let device = require('device.js')();
let isDesktop: boolean = device.desktop();
let isMobile: boolean = device.mobile();

@Injectable()
export class StreetDrawService {
  public width: number;
  public height: number;
  public halfOfHeight: number;
  public lowIncome: number;
  public highIncome: number;
  public streetOffset: number = 60;
  public chosenPlaces: any;
  private poorest: string = 'POOREST';
  private richest: string = 'RICHEST';
  private scale: any;
  private axisLabel: number[] = [];
  private svg: any;
  private incomeArr: any[] = [];
  private mouseMoveSubscriber: any;
  private dividersData: any;
  private mouseUpSubscriber: any;
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
  private leftPoint: any;
  private rightPoint: any;
  private leftScrollOpacityStreet: any;
  private leftScrollOpacityLabels: any;
  private leftScrollOpacityHomes: any;
  private rightScrollOpacityStreet: any;
  private rightScrollOpacityLabels: any;
  private rightScrollOpacityHomes: any;
  private leftScrollText: any;
  private rightScrollText: any;
  private hoverPlace: any;
  private minIncome: any;
  private maxIncome: any;
  private regions: string[] | string;
  private thingname: string;
  private countries: string[] | string;
  private placesArray: any[] = [];
  private math: MathService;
  private currentLowIncome: number;
  private currentHighIncome: number;
  private filter: Subject<any> = new Subject<any>();
  private windowInnerWidth: number = window.innerWidth;
  private colors: {fills: any, fillsOfBorders: any} = {
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

  public constructor(math: MathService) {
    this.math = math;
  }

  public init(lowIncome: any, highIncome: any, drawDividers: DrawDividersInterface, regions: any, countries: any, thing: string): this {
    this.thingname = thing;
    this.countries = countries[0];
    this.regions = regions[0];
    this.axisLabel = [drawDividers.low, drawDividers.medium, drawDividers.high];
    this.dividersData = drawDividers;
    this.lowIncome = lowIncome || drawDividers.poor;
    this.highIncome = highIncome || drawDividers.rich;
    this.width = parseInt(this.svg.style('width'), 10) - this.streetOffset;
    this.height = parseInt(this.svg.style('height'), 10);
    this.halfOfHeight = 0.5 * this.height;
    this.windowInnerWidth = window.innerWidth;

    this.scale = d3
      .scale.log()
      .domain([drawDividers.poor, drawDividers.low, drawDividers.medium, drawDividers.high, drawDividers.rich])
      .range([0, drawDividers.lowDividerCoord / 1000 * this.width, drawDividers.mediumDividerCoord / 1000 * this.width, drawDividers.highDividerCoord / 1000 * this.width, this.width]);

    return this;
  }

  public set setSvg(element: HTMLElement) {
    this.svg = d3.select(element);
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
      .attr('y', this.height - 2)
      .attr('fill', '#767d86');

    this.svg
      .selectAll('image.scale-label22222')
      .data(this.axisLabel)
      .enter()
      .append('svg:image')
      .attr('class', 'scale-label22222')
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
      });

    return this;
  }

  public drawScale(places: any, drawDividers: any): this {
    let halfHouseWidth = 7;
    let roofX = 2 - halfHouseWidth;
    let roofY = this.halfOfHeight - 10;

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
      .attr('y', this.height - 4)
      .attr('fill', '#767d86');

    this.svg
      .selectAll('text.richest')
      .data([this.richest])
      .enter()
      .append('text')
      .attr('class', 'richest')
      .text(this.richest)
      .attr('x', this.width + this.streetOffset - 50)
      .attr('y', this.height - 4)
      .attr('fill', '#767d86');

    if (places && places.length) {
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
            this.placesArray.push(datum);

            this.placesArray = _
              .chain(this.placesArray)
              .uniqBy('_id')
              .sortBy('income')
              .value();

            this.minIncome = _.head(this.placesArray).income;
            this.maxIncome = _.last(this.placesArray).income;
            this.leftPoint = this.scale(this.minIncome);
            this.rightPoint = this.scale(this.maxIncome);

            point1 = `${this.streetOffset / 2 + scaleDatumIncome + roofX },${this.halfOfHeight - 4}`;
            point2 = `${this.streetOffset / 2 + scaleDatumIncome + roofX},${roofY}`;
            point3 = `${this.streetOffset / 2 + scaleDatumIncome - halfHouseWidth},${roofY}`;
            point4 = `${this.streetOffset / 2 + scaleDatumIncome},${this.halfOfHeight - 17}`;
            point5 = `${this.streetOffset / 2 + scaleDatumIncome + halfHouseWidth },${roofY}`;
            point6 = `${this.streetOffset / 2 + scaleDatumIncome - roofX },${roofY}`;
            point7 = `${this.streetOffset / 2 + scaleDatumIncome - roofX },${this.halfOfHeight - 4}`;
          }

          return !datum ? void 0 : point1 + ' ' + point2 + ' ' +
          point3 + ' ' + point4 + ' ' + point5 + ' ' + point6 + ' ' + point7;
        })
        .attr('stroke-width', 1)
        .style('fill', '#aaacb0')
        .style('opacity', '0.7');
    }

    this.svg
      .append('polygon')
      .attr('class', 'road')
      .attr('height', '14px')
      .attr('points', () => {
        let point1 = `0,${ this.halfOfHeight + 11}`;
        let point2 = `30,${ this.halfOfHeight - 4}`;
        let point3 = `${ this.width + this.streetOffset - this.streetOffset / 2},${ this.halfOfHeight - 4}`;
        let point4 = `${ this.width + this.streetOffset},${ this.halfOfHeight + 11}`;
        return `${point1} ${point2} ${point3} ${point4}`;
      })
      .style('fill', '#727a82')
      .style('cursor', '-webkit-grab')
      .style('cursor', '-moz-grab')
      .style('cursor', 'grab')
      .on('mousedown', (): void => {
        d3.event.preventDefault();
        this.draggingSliders = true;
      })
      .on('touchstart', (): any => this.draggingSliders = true);

    this.svg
      .append('line')
      .attr('class', 'axis')
      .attr('height', '3px')
      .attr('x1', 1)
      .attr('y1', this.halfOfHeight + 11.5)
      .attr('x2', this.width + this.streetOffset - 1)
      .attr('y2', this.halfOfHeight + 11.5)

      .attr('stroke-width', 3)
      .attr('stroke', '#525c64')
      .style('cursor', '-webkit-grab')
      .style('cursor', '-moz-grab')
      .style('cursor', 'grab')
      .on('mousedown', (): void => {
        d3.event.preventDefault();
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
        d3.event.preventDefault();
        this.draggingSliders = true;
      })
      .on('touchstart', (): any => this.draggingSliders = true);

    this.incomeArr.length = 0;

    this.isDrawDividers(drawDividers);

    if (!places || !places.length) {
      return this;
    }

    this.drawLeftSlider(this.scale(this.lowIncome), true);
    this.drawRightSlider(this.scale(this.highIncome), true);

    if (this.mouseMoveSubscriber) {
      this.mouseMoveSubscriber.unsubscribe();
    }

    this.mouseMoveSubscriber = fromEvent(window, 'mousemove')
      .subscribe((e: MouseEvent)=> {

        if (this.windowInnerWidth < 600 || (!this.sliderLeftMove && !this.sliderRightMove && !this.draggingSliders)) {
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

          if ((this.thingname !== 'Families' || this.countries !== 'World' || this.regions !== 'World') && !isMobile) {
            if (e.pageX - this.distanceDraggingLeftSlider >= this.leftPoint + 40 && e.pageX + this.distanceDraggingRightSlider <= this.rightPoint + 76) {
              this.chosenPlaces = [];
              this.removeHouses('chosen');
              this.drawLeftSlider(e.pageX - 57 - this.distanceDraggingLeftSlider);
              this.drawRightSlider(e.pageX - 57 + this.distanceDraggingRightSlider);
            }
          } else {
            if (
              e.pageX - this.distanceDraggingLeftSlider >= 50 &&
              e.pageX + this.distanceDraggingRightSlider <= this.width + 60) {
              this.chosenPlaces = [];
              this.removeHouses('chosen');
              this.drawLeftSlider(e.pageX - 47 - this.distanceDraggingLeftSlider);
              this.drawRightSlider(e.pageX - 57 + this.distanceDraggingRightSlider);
            }
          }

          return;
        }

        if (this.sliderLeftMove && e.pageX <= this.sliderRightBorder + 17 && e.pageX >= 52) {
          return this.drawLeftSlider(e.pageX - 47);
        }

        if (this.sliderRightMove && this.sliderLeftBorder + 87 <= e.pageX && e.pageX <= this.width + 57) {
          return this.drawRightSlider(e.pageX - 57);
        }
      });

    if (this.touchMoveSubscriber) {
      this.touchMoveSubscriber.unsubscribe();
    }

    this.touchMoveSubscriber = fromEvent(window, 'touchmove')
      .subscribe((e: TouchEvent)=> {
          if (this.windowInnerWidth < 600 || (!this.sliderLeftMove && !this.sliderRightMove && !this.draggingSliders)) {
            return;
          }

          if (!this.currentHighIncome || !this.currentLowIncome) {
            this.currentLowIncome = this.lowIncome;
            this.currentHighIncome = this.highIncome;
          }
          let positionX = e.touches[0].pageX;

          if (this.draggingSliders && !this.sliderLeftMove && !this.sliderRightMove) {
            document.body.classList.add('draggingSliders');

            if (!this.distanceDraggingLeftSlider) {
              this.distanceDraggingLeftSlider = positionX - 35 - this.sliderLeftBorder;
            }

            if (!this.distanceDraggingRightSlider) {
              this.distanceDraggingRightSlider = this.sliderRightBorder - (positionX - 45);
            }

            if ((this.thingname !== 'Families' || this.countries !== 'World' || this.regions !== 'World') && !isMobile) {
              if (positionX - this.distanceDraggingLeftSlider >= this.leftPoint + 40 && positionX + this.distanceDraggingRightSlider <= this.rightPoint + 75) {
                this.chosenPlaces = [];
                this.removeHouses('chosen');
                this.drawLeftSlider(positionX - 57 - this.distanceDraggingLeftSlider);
                this.drawRightSlider(positionX - 57 + this.distanceDraggingRightSlider);
              }
            } else {
              if (
                positionX - this.distanceDraggingLeftSlider >= 35 &&
                positionX + this.distanceDraggingRightSlider <= this.width + 50) {
                this.chosenPlaces = [];
                this.removeHouses('chosen');
                this.drawLeftSlider(positionX - 30 - this.distanceDraggingLeftSlider);
                this.drawRightSlider(positionX - 40 + this.distanceDraggingRightSlider);
              }
            }
            return;
          }

          if (this.sliderLeftMove && positionX <= this.sliderRightBorder - 25 && positionX >= 35) {
            return this.drawLeftSlider(positionX - 30);
          }

          if (this.sliderRightMove && this.sliderLeftBorder + 102 <= positionX && positionX <= this.width + 50) {
            return this.drawRightSlider(positionX - 40);
          }
        }
      );

    this.mouseUpSubscriber = fromEvent(window, 'mouseup')
      .subscribe(()=> {

        if (this.windowInnerWidth < 600 || (!this.sliderLeftMove && !this.sliderRightMove && !this.draggingSliders)) {
          return;
        }

        this.pressedSlider();
      });

    this.touchUpSubscriber = fromEvent(window, 'touchend')
      .subscribe(()=> {
        if (this.windowInnerWidth < 600 || (!this.sliderLeftMove && !this.sliderRightMove && !this.draggingSliders)) {
          return;
        }

        this.pressedSlider();
      });

    return this;
  };

  public drawHoverHouse(place: any, gray: boolean = false): this {
    if (!place) {
      return this;
    }

    this.removeSliders();

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
          point1 = `${scaleDatumIncome + this.streetOffset / 2 + roofX },${this.halfOfHeight - 4}`;
          point2 = `${scaleDatumIncome + this.streetOffset / 2 + roofX},${roofY - 2}`;
          point3 = `${scaleDatumIncome + this.streetOffset / 2 - halfHouseWidth},${roofY - 2 }`;
          point4 = `${scaleDatumIncome + this.streetOffset / 2 },${this.halfOfHeight - 26 - 1 - 2}`;
          point5 = `${scaleDatumIncome + this.streetOffset / 2 + halfHouseWidth },${roofY - 2}`;
          point6 = `${scaleDatumIncome + this.streetOffset / 2 - roofX },${roofY - 2}`;
          point7 = `${scaleDatumIncome + this.streetOffset / 2 - roofX },${this.halfOfHeight - 4 }`;
        }

        return !datum ? void 0 : point1 + ' ' + point2 + ' ' +
        point3 + ' ' + point4 + ' ' + point5 + ' ' + point6 + ' ' + point7;
      })
      .attr('stroke-width', 1)
      .attr('stroke', (datum: any): any => {
        if (gray) {
          return '#303e4a';
        }

        return !datum ? void 0 : fillsOfBorders[datum.region];
      })
      .style('fill', (datum: any): any => {
        if (gray) {
          return '#374551';
        }

        return !datum ? void 0 : fills[datum.region];
      });
    this.drawLeftSlider(this.scale(this.lowIncome), true);
    this.drawRightSlider(this.scale(this.highIncome), true);
    return this;
  };

  protected drawLeftSlider(x: number, init: boolean = false): this {
    if (this.windowInnerWidth <= 566) {
      return;
    }

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
          .attr('class', 'left-scroll-opacity-labels')
          .attr('x', 0)
          .attr('y', 50)
          .attr('height', 15)
          .style('fill', 'white')
          .attr('width', x + this.streetOffset / 2)
          .style('opacity', '0.1');
      } else {
        this.leftScrollOpacityLabels
          .append('rect')
          .attr('class', 'left-scroll-opacity-labels')
          .attr('x', 0)
          .attr('y', 50)
          .attr('height', 15)
          .style('fill', 'white')
          .attr('width', x + this.streetOffset / 2)
          .style('opacity', '0.6');
      }
    }

    if (!this.leftScroll) {
      this.leftScroll = this.svg
        .append('polygon')
        .attr('class', 'left-scroll')
        .style('fill', '#515c65')
        .style('cursor', 'pointer')
        .attr('id', 'left-scroll')
        .attr('stroke-width', 0.5)
        .attr('stroke', '#ffffff')
        .on('mousedown', (): void => {
          d3.event.preventDefault();
          this.sliderLeftMove = true;
        })
        .on('touchstart', (): any => this.sliderLeftMove = true);
    }
    this.leftScroll
      .attr('points', () => {
        let point1 = `${x + this.streetOffset / 2 - 9 },${ this.halfOfHeight + 12 - 1 - 1}`;
        let point2 = `${x + this.streetOffset / 2 - 9},${ this.halfOfHeight - 5 - 1 - 1 - 1 - 4 + 2}`;
        let point3 = `${x + this.streetOffset / 2 + 9},${ this.halfOfHeight - 5 - 1 - 1 - 1 - 4 + 2}`;
        let point4 = `${x + this.streetOffset / 2 + 9},${ this.halfOfHeight + 12 - 1 - 1}`;
        let point5 = `${x + this.streetOffset / 2 },${ this.halfOfHeight + 12 + 5 - 1 + 2 }`;

        if ((this.thingname !== 'Families' || this.countries !== 'World' || this.regions !== 'World') && !isMobile) {
          if (Math.round(this.leftPoint + this.streetOffset / 2) > Math.round(x + this.streetOffset / 2 + 4)) {
            point1 = `${this.leftPoint + this.streetOffset / 2 - 9 - 12 },${ this.halfOfHeight + 12 - 1 - 1}`;
            point2 = `${this.leftPoint + this.streetOffset / 2 - 9 - 12},${ this.halfOfHeight - 5 - 1 - 1 - 1 - 4 + 2}`;
            point3 = `${this.leftPoint + this.streetOffset / 2 + 9 - 12},${ this.halfOfHeight - 5 - 1 - 1 - 1 - 4 + 2}`;
            point4 = `${this.leftPoint + this.streetOffset / 2 + 9 - 12},${ this.halfOfHeight + 12 - 1 - 1}`;
            point5 = `${this.leftPoint + this.streetOffset / 2 - 12},${ this.halfOfHeight + 12 + 5 - 1 + 2 }`;

          }
        }

        if (this.windowInnerWidth < 600) {
          point1 = `${x + 2 + this.streetOffset / 2 - 9},${ this.halfOfHeight + 14 - 1}`;
          point2 = `${x + 2 + this.streetOffset / 2 - 9},${ this.halfOfHeight + 14 - 5 - 1 - 1}`;
          point3 = `${x + 2 + this.streetOffset / 2 + 1},${ this.halfOfHeight + 14 - 5 - 1 - 1 }`;
          point4 = `${x + 2 + this.streetOffset / 2 + 1},${ this.halfOfHeight + 14 - 1}`;
          point5 = `${x + 2 + this.streetOffset / 2 - 4},${ this.halfOfHeight + 14 + 5 - 1}`;
        }

        return `${point1} ${point2} ${point3} ${point4} ${point5}`;
      });

    if (isDesktop) {
      this.leftScroll
        .attr('points', () => {
          let point1 = `${x + this.streetOffset / 2 - 9 },${ this.halfOfHeight + 12 - 1}`;
          let point2 = `${x + this.streetOffset / 2 - 9},${ this.halfOfHeight - 5 - 1 - 1 - 1}`;
          let point3 = `${x + this.streetOffset / 2 + 1},${ this.halfOfHeight - 5 - 1 - 1 - 1}`;
          let point4 = `${x + this.streetOffset / 2 + 1},${ this.halfOfHeight + 12 - 1}`;
          let point5 = `${x + this.streetOffset / 2 - 4},${ this.halfOfHeight + 12 + 5 - 1}`;

          if ((this.thingname !== 'Families' || this.countries !== 'World' || this.regions !== 'World') && !isMobile) {

            if (Math.round(this.leftPoint + this.streetOffset / 2) > Math.round(x + this.streetOffset / 2 + 4)) {
              point1 = `${this.leftPoint + this.streetOffset / 2 - 9 - 12 },${ this.halfOfHeight + 12 - 1}`;
              point2 = `${this.leftPoint + this.streetOffset / 2 - 9 - 12},${ this.halfOfHeight - 5 - 1 - 1 - 1}`;
              point3 = `${this.leftPoint + this.streetOffset / 2 + 1 - 12},${ this.halfOfHeight - 5 - 1 - 1 - 1}`;
              point4 = `${this.leftPoint + this.streetOffset / 2 + 1 - 12},${ this.halfOfHeight + 12 - 1}`;
              point5 = `${this.leftPoint + this.streetOffset / 2 - 4 - 12},${ this.halfOfHeight + 12 + 5 - 1}`;
            }
          }
          return `${point1} ${point2} ${point3} ${point4} ${point5}`;
        });
    }

    if ((this.thingname !== 'Families' || this.countries !== 'World' || this.regions !== 'World') && !isMobile) {
      if (Math.round(this.leftPoint + this.streetOffset / 2) > Math.round(x + this.streetOffset / 2 + 4)) {
        this.sliderLeftBorder = this.leftPoint - 12;
        this.leftScrollOpacityStreet
          .attr('width', this.leftPoint - 12 + this.streetOffset / 2);
        this.leftScrollOpacityHomes
          .attr('width', this.leftPoint - 12 + this.streetOffset / 2);
      } else {
        this.leftScrollOpacityStreet
          .attr('width', x + this.streetOffset / 2);
        this.leftScrollOpacityHomes
          .attr('width', x + this.streetOffset / 2);
      }
    } else {
      this.leftScrollOpacityStreet
        .attr('width', x + this.streetOffset / 2);
      this.leftScrollOpacityHomes
        .attr('width', x + this.streetOffset / 2);
    }

    this.lowIncome = this.scale.invert(x);

    if (init) {
      return this;
    }

    this.drawScrollLabel();

    return this;
  };

  protected drawRightSlider(x: number, init: boolean = false): this {
    if (this.windowInnerWidth <= 566) {
      return;
    }

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
          .attr('class', 'right-scroll-opacity-labels')
          .attr('x', x + 9)
          .attr('y', 50)
          .attr('height', 15)
          .style('fill', 'white')
          .attr('width', this.width - x + this.streetOffset)
          .style('opacity', '0.1');
      } else {
        this.rightScrollOpacityLabels
          .append('rect')
          .attr('class', 'right-scroll-opacity-labels')
          .attr('x', x + 20)
          .attr('y', 50)
          .attr('height', 15)
          .style('fill', 'white')
          .attr('width', this.width - x + this.streetOffset)
          .style('opacity', '0.65');
      }
    }

    if (!this.rightScroll) {
      this.rightScroll = this.svg
        .append('polygon')
        .attr('class', 'right-scroll')
        .style('fill', '#515c65')
        .style('cursor', 'pointer')
        .attr('stroke-width', 0.5)
        .attr('stroke', 'white')
        .on('mousedown', (): void=> {
          d3.event.preventDefault();
          this.sliderRightMove = true;
        })
        .on('touchstart', (): any => this.sliderRightMove = true);
    }

    this.rightScroll.attr('points', () => {
      let point1 = `${x + this.streetOffset / 2 - 9},${this.halfOfHeight + 12 - 1 - 1 }`;
      let point2 = `${x + this.streetOffset / 2 - 9},${this.halfOfHeight - 5 - 1 - 1 - 1 - 4 + 2}`;
      let point3 = `${x + this.streetOffset / 2 + 9},${this.halfOfHeight - 5 - 1 - 1 - 1 - 4 + 2}`;
      let point4 = `${x + this.streetOffset / 2 + 9},${this.halfOfHeight + 12 - 1 - 1}`;
      let point5 = `${x + this.streetOffset / 2},${this.halfOfHeight + 12 + 5 - 1 + 2}`;

      if ((this.thingname !== 'Families' || this.countries !== 'World' || this.regions !== 'World') && !isMobile) {

        if (Math.round(this.rightPoint + this.streetOffset / 2) < Math.round(x + this.streetOffset / 2 - 1)) {
          point1 = `${this.rightPoint + this.streetOffset / 2 - 9 + 12},${this.halfOfHeight + 12 - 1 - 1 }`;
          point2 = `${this.rightPoint + this.streetOffset / 2 - 9 + 12},${this.halfOfHeight - 5 - 1 - 1 - 1 - 4 + 2}`;
          point3 = `${this.rightPoint + this.streetOffset / 2 + 9 + 12},${this.halfOfHeight - 5 - 1 - 1 - 1 - 4 + 2}`;
          point4 = `${this.rightPoint + this.streetOffset / 2 + 9 + 12},${this.halfOfHeight + 12 - 1 - 1}`;
          point5 = `${this.rightPoint + this.streetOffset / 2 + 12},${this.halfOfHeight + 12 + 5 - 1 + 2}`;
        }
      }

      if (this.windowInnerWidth < 600) {
        point1 = `${x - 2 + this.streetOffset / 2 - 1 },${this.halfOfHeight + 14 - 1}`;
        point2 = `${x - 2 + this.streetOffset / 2 - 1 },${this.halfOfHeight + 14 - 5 - 1 - 1}`;
        point3 = `${x - 2 + this.streetOffset / 2 + 9 },${this.halfOfHeight + 14 - 5 - 1 - 1}`;
        point4 = `${x - 2 + this.streetOffset / 2 + 9 },${this.halfOfHeight + 14 - 1}`;
        point5 = `${x - 2 + this.streetOffset / 2 + 4 },${this.halfOfHeight + 14 + 5 - 1}`;
      }

      return `${point1} ${point2} ${point3} ${point4} ${point5}`;
    });

    if (isDesktop) {
      this.rightScroll.attr('points', () => {
        let point1 = `${x + this.streetOffset / 2 - 1},${this.halfOfHeight + 12 - 1 }`;
        let point2 = `${x + this.streetOffset / 2 - 1},${this.halfOfHeight - 5 - 1 - 1 - 1}`;
        let point3 = `${x + this.streetOffset / 2 + 9},${this.halfOfHeight - 5 - 1 - 1 - 1}`;
        let point4 = `${x + this.streetOffset / 2 + 9},${this.halfOfHeight + 12 - 1}`;
        let point5 = `${x + this.streetOffset / 2 + 4},${this.halfOfHeight + 12 + 5 - 1}`;

        if ((this.thingname !== 'Families' || this.countries !== 'World' || this.regions !== 'World') && !isMobile) {
          if (Math.round(this.rightPoint + this.streetOffset / 2) < Math.round(x + this.streetOffset / 2 - 1)) {

            point1 = `${this.rightPoint + this.streetOffset / 2 - 1 + 12},${this.halfOfHeight + 12 - 1 }`;
            point2 = `${this.rightPoint + this.streetOffset / 2 - 1 + 12},${this.halfOfHeight - 5 - 1 - 1 - 1}`;
            point3 = `${this.rightPoint + this.streetOffset / 2 + 9 + 12},${this.halfOfHeight - 5 - 1 - 1 - 1}`;
            point4 = `${this.rightPoint + this.streetOffset / 2 + 9 + 12},${this.halfOfHeight + 12 - 1}`;
            point5 = `${this.rightPoint + this.streetOffset / 2 + 4 + 12},${this.halfOfHeight + 12 + 5 - 1}`;
          }
        }

        return `${point1} ${point2} ${point3} ${point4} ${point5}`;
      });
    }

    if (this.thingname !== 'Families' || this.countries !== 'World' || this.regions !== 'World' && !isMobile) {
      if (Math.round(this.rightPoint + this.streetOffset / 2) < Math.round(x + this.streetOffset / 2 - 1)) {
        this.sliderRightBorder = this.rightPoint + 12;
        this.rightScrollOpacityStreet.attr('x', this.rightPoint + this.streetOffset / 2 + 1.5 + 12)
          .attr('width', this.width + this.streetOffset / 2);
        this.rightScrollOpacityHomes.attr('x', this.rightPoint + this.streetOffset / 2 + 1.5 + 12)
          .attr('width', this.width + this.streetOffset / 2);
      } else {
        this.rightScrollOpacityStreet.attr('x', x + this.streetOffset / 2 + 1.5)
          .attr('width', this.width + this.streetOffset / 2 - x);
        this.rightScrollOpacityHomes.attr('x', x + this.streetOffset / 2 + 1.5)
          .attr('width', this.width + this.streetOffset / 2 - x);
      }
    } else {
      this.rightScrollOpacityStreet.attr('x', x + this.streetOffset / 2 + 1.5)
        .attr('width', this.width + this.streetOffset / 2 - x);
      this.rightScrollOpacityHomes.attr('x', x + this.streetOffset / 2 + 1.5)
        .attr('width', this.width + this.streetOffset / 2 - x);
    }

    this.highIncome = this.scale.invert(x);

    if (init) {
      return this;
    }

    this.drawScrollLabel();

    return this;
  };

  public clearAndRedraw(places: any): this {
    if (!places || !places.length) {
      this.removeHouses('hover');
      this.removeHouses('chosen');

      return this;
    }

    this.removeHouses('hover');
    this.removeHouses('chosen');
    this.removeSliders();
    this.drawHouses(places);
    this.drawHoverHouse(this.hoverPlace);
    this.drawLeftSlider(this.scale(this.lowIncome), true);
    this.drawRightSlider(this.scale(this.highIncome), true);

    return this;
  };

  public removeHouses(selector: any): this {
    this.svg.selectAll('rect.' + selector).remove();
    this.svg.selectAll('polygon.' + selector).remove();
    if (selector === 'chosen') {
      this.svg.selectAll('polygon.chosenLine').remove();
    }

    return this;
  };

  public removeSliders(): this {
    this.svg.selectAll('polygon.right-scroll').remove();
    this.svg.selectAll('polygon.left-scroll').remove();
    this.leftScroll = false;
    this.rightScroll = false;
    return this;
  };

  public clearSvg(): this {
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

  private drawScrollLabel(): this {
    let incomeL: any = Math.round(this.lowIncome ? this.lowIncome : 0);
    let incomeR: any = Math.round(this.highIncome ? this.highIncome : this.dividersData.rich);

    if (incomeR > this.dividersData.rich) {
      incomeR = this.dividersData.rich;
    }

    let xL = this.scale(incomeL);
    let xR = this.scale(incomeR);

    if (((this.dividersData.lowDividerCoord / 1000 * (this.width + this.streetOffset / 2)) < xR + 45) && ((this.dividersData.lowDividerCoord / 1000 * (this.width + this.streetOffset / 2)) + 45 > xR) || ((this.dividersData.lowDividerCoord / 1000 * (this.width + this.streetOffset / 2)) < xL + 45) && ((this.dividersData.lowDividerCoord / 1000 * (this.width + this.streetOffset / 2)) + 45 > xL )) {
      this.svg.selectAll('text.scale-label' + this.dividersData.low).attr('fill', '#fff');
    } else {
      this.svg.selectAll('text.scale-label' + this.dividersData.low).attr('fill', '#767d86');
    }

    if (((this.dividersData.mediumDividerCoord / 1000 * (this.width + this.streetOffset / 2)) < xR + 115) && ((this.dividersData.mediumDividerCoord / 1000 * (this.width + this.streetOffset / 2)) + 55 > xR) || ((this.dividersData.mediumDividerCoord / 1000 * (this.width + this.streetOffset / 2)) < xL + 115) && ((this.dividersData.mediumDividerCoord / 1000 * (this.width + this.streetOffset / 2)) + 55 > xL )) {
      this.svg.selectAll('text.scale-label' + this.dividersData.medium).attr('fill', '#fff');
    } else {
      this.svg.selectAll('text.scale-label' + this.dividersData.medium).attr('fill', '#767d86');
    }

    if (((this.dividersData.highDividerCoord / 1000 * (this.width + this.streetOffset / 2)) < xR + 140) && ((this.dividersData.highDividerCoord / 1000 * (this.width + this.streetOffset / 2)) + 65 > xR) || ((this.dividersData.highDividerCoord / 1000 * (this.width + this.streetOffset / 2)) < xL + 140) && ((this.dividersData.highDividerCoord / 1000 * (this.width + this.streetOffset / 2)) + 65 > xL )) {
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
        .text(`${incomeL}$`)
        .attr('y', this.height - 2)
        .attr('fill', '#767d86');
    }

    if (!this.rightScrollText) {
      this.rightScrollText = this.svg
        .append('text')
        .attr('class', 'right-scroll-label')
        .text(`${incomeR}$`)
        .attr('y', this.height - 2)
        .attr('fill', '#767d86');
    }
    if (Math.round(this.leftPoint + this.streetOffset / 2) > Math.round(xL + this.streetOffset / 2 + 4) && (this.thingname !== 'Families' || this.countries !== 'World' || this.regions !== 'World') && !isMobile) {
      incomeL = Math.round(this.minIncome);
      incomeL = this.math.round(incomeL);

      this.leftScrollText
        .text(`${incomeL}$`)
        .attr('x', ()=> this.leftPoint + this.streetOffset / 2 - 4.5 - this.leftScrollText[0][0].getBBox().width / 2);
    } else {
      this.leftScrollText
        .text(`${incomeL}$`)
        .attr('x', ()=> xL + this.streetOffset / 2 - 4.5 - this.leftScrollText[0][0].getBBox().width / 2);
    }

    if (Math.round(this.rightPoint + this.streetOffset / 2) < Math.round(xR + this.streetOffset / 2 - 1) && (this.thingname !== 'Families' || this.countries !== 'World' || this.regions !== 'World') && !isMobile) {
      incomeR = Math.round(this.maxIncome);
      incomeR = this.math.round(incomeR);

      this.rightScrollText
        .text(`${incomeR}$`)
        .attr('x', ()=> this.rightPoint + this.streetOffset / 2 + 4.5 - this.rightScrollText[0][0].getBBox().width / 2);
    } else {
      this.rightScrollText
        .text(`${incomeR}$`)
        .attr('x', ()=> xR + this.streetOffset / 2 + 4.5 - this.rightScrollText[0][0].getBBox().width / 2);
    }

    return this;
  };

  private drawHouses(places: any): this {
    this.placesArray = [];

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
      .attr('id', 'houses')
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
          point1 = `${this.streetOffset / 2 + scaleDatumIncome + roofX},${this.halfOfHeight - 1 - 1 - 2}`;
          point2 = `${this.streetOffset / 2 + scaleDatumIncome + roofX},${roofY - 2}`;
          point3 = `${this.streetOffset / 2 + scaleDatumIncome - halfHouseWidth },${roofY - 2}`;
          point4 = `${this.streetOffset / 2 + scaleDatumIncome },${ this.halfOfHeight - 21 - 1 - 2}`;
          point5 = `${this.streetOffset / 2 + scaleDatumIncome + halfHouseWidth },${roofY - 2}`;
          point6 = `${this.streetOffset / 2 + scaleDatumIncome - roofX },${ roofY - 2}`;
          point7 = `${this.streetOffset / 2 + scaleDatumIncome - roofX },${ this.halfOfHeight - 1 - 1 - 2}`;
        }

        return !datum ? void 0 : point1 + ' ' + point2 + ' ' +
        point3 + ' ' + point4 + ' ' + point5 + ' ' + point6 + ' ' + point7;
      })
      .attr('stroke', '#303e4a')
      .attr('stroke-width', 1)
      .style('fill', '#374551');

    return this;
  };

  private pressedSlider(): void {
    document.body.classList.remove('draggingSliders');
    if (this.draggingSliders && !this.distanceDraggingLeftSlider && !this.distanceDraggingRightSlider) {
      this.draggingSliders = false;
      this.distanceDraggingLeftSlider = void 0;
      this.distanceDraggingRightSlider = void 0;

      if (this.leftScrollText || this.rightScrollText) {
        this.leftScrollText.text('');
        this.rightScrollText.text('');
      }

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
      this.highIncome = this.dividersData.rich + 0.00002;
    }

    if ((this.thingname !== 'Families' || this.countries !== 'World' || this.regions !== 'World') && !isMobile) {

      if (this.lowIncome < this.minIncome) {
        this.filter.next({
          lowIncome: Math.round(this.minIncome - 3),
          highIncome: Math.round(this.highIncome)
        });
      }

      if (this.highIncome > this.maxIncome) {
        this.filter.next({
          lowIncome: Math.round(this.lowIncome),
          highIncome: Math.round(this.maxIncome + 5)
        });
      }

      if (this.highIncome < this.maxIncome && this.lowIncome > this.minIncome) {
        this.filter.next({
          lowIncome: Math.round(this.lowIncome),
          highIncome: Math.round(this.highIncome)
        });
      }

    } else {
      this.filter.next({
        lowIncome: Math.round(this.lowIncome),
        highIncome: Math.round(this.highIncome)
      });
    }
  }
}
