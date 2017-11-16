import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { DrawDividersInterface, BrowserDetectionService } from '../../common';
import { scaleLog } from 'd3-scale';
import { select } from 'd3-selection';

@Injectable()
export class StreetPinnedDrawService {
  public width: number;
  public height: number;
  public halfOfHeight: number;
  public streetOffset: number = 60;
  public chosenPlaces: any;
  public scale: any;
  public axisLabel: number[] = [];
  public svg: any;
  public draggingSliders: boolean = false;
  //public hoverPlace: any;
  public windowInnerWidth: number = window.innerWidth;
  public device: BrowserDetectionService;
  public isDesktop: boolean;
  public isMobile: boolean;
  public poorest: string;
  public richest: string;
  public colors: {fills: any, fillsOfBorders: any} = {
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

  public constructor(browserDetectionService: BrowserDetectionService) {
    this.device = browserDetectionService;
    this.isDesktop = this.device.isDesktop();
    this.isMobile = this.device.isMobile();
  }

  public init(drawDividers: DrawDividersInterface): this {
    this.axisLabel = [drawDividers.low, drawDividers.medium, drawDividers.high];
    this.width = parseInt(this.svg.style('width'), 10) - this.streetOffset;
    this.height = parseInt(this.svg.style('height'), 10);
    this.halfOfHeight = 0.5 * this.height;
    this.windowInnerWidth = window.innerWidth;

    this.scale = scaleLog()
      .domain([drawDividers.poor, drawDividers.rich])
      .range([0, this.width]);
      //.domain([drawDividers.poor, drawDividers.low, drawDividers.medium, drawDividers.high, drawDividers.rich])
      //.range([0, drawDividers.lowDividerCoord / 1000 * this.width, drawDividers.mediumDividerCoord / 1000 * this.width, drawDividers.highDividerCoord / 1000 * this.width, this.width]);

    return this;
  }

  public set setSvg(element: HTMLElement) {
    this.svg = select(element);
  }

  public drawRoad(): this {
    const vertOffset = 20;

    this.svg
      .append('polygon')
      .attr('class', 'road')
      .attr('points', () => {
        let point1: string = `0,${this.height - vertOffset + 2}`;
        let point2: string = `19,${this.height - vertOffset - 12}`;
        let point3: string = `${this.width + this.streetOffset - 19},${this.height - vertOffset - 12}`;
        let point4: string = `${this.width + this.streetOffset},${this.height - vertOffset + 2}`;

        return `${point1} ${point2} ${point3} ${point4}`;
      })
      .style('fill', '#727a82');

    this.svg
      .append('line')
      .attr('class', 'axis')
      .attr('x1', 1)
      .attr('y1', this.height - vertOffset + 2)
      .attr('x2', this.width + this.streetOffset - 1)
      .attr('y2', this.height - vertOffset + 2)

      .attr('stroke-width', 2)
      .attr('stroke', '#525c64');

    this.svg
      .append('line')
      .attr('class', 'dash')
      .attr('x1', 24)
      .attr('y1', this.height - vertOffset - 5)
      .attr('x2', this.width + this.streetOffset - 24)
      .attr('y2', this.height - vertOffset - 5)
      .attr('stroke-dasharray', '17')
      .attr('stroke-width', 2)
      .attr('stroke', 'white');

    /*this.svg
      .selectAll('text.poorest')
      .data([this.poorest])
      .enter()
      .append('text')
      .attr('class', 'poorest')
      .text(this.poorest)
      .attr('x', 0)
      .attr('y', this.height)
      .attr('fill', '#767d86')
      .attr('font-size', '20px');*/

    /*this.svg
      .selectAll('text.richest')
      .data([this.richest])
      .enter()
      .append('text')
      .attr('class', 'richest')
      .text(this.richest)
      .attr('y', this.height)
      .attr('fill', '#767d86')
      .attr('font-size', '20px');*/

    /*let svgElement: any = document.getElementById('chart');
    let svgElementNodes: any = svgElement.childNodes;
    let richestWidth = svgElementNodes[4].getBBox().width;

    richestWidth = !isNaN(richestWidth) ? richestWidth : 54;

    this.svg
      .selectAll('text.richest')
      .attr('x', this.width + 60 - richestWidth);*/

    return this;
  };

  public drawHouses(places: any[]): this {
    if (!places || !places.length) {
      return this;
    }

    let fills = this.colors.fills;
    let fillsOfBorders = this.colors.fillsOfBorders;
    let halfHouseWidth = 10;
    let roofX = 2 - halfHouseWidth;
    let houseOffset = 4;

    this.svg
      .selectAll()
      .data(places)
      .enter()
      .append('polygon')
      .attr('class', 'point')
      .attr('points', (datum: any): any => {
        let scaleDatumIncome: number = this.scale(datum.income);

        let point1: string = `${this.streetOffset / 2 + scaleDatumIncome + roofX - 1},${houseOffset + 28}`;
        let point2: string = `${this.streetOffset / 2 + scaleDatumIncome + roofX - 1},${houseOffset + 13}`;
        let point3: string = `${this.streetOffset / 2 + scaleDatumIncome - halfHouseWidth - 2},${houseOffset + 13}`;
        let point4: string = `${this.streetOffset / 2 + scaleDatumIncome},${houseOffset + 2}`;
        let point5: string = `${this.streetOffset / 2 + scaleDatumIncome + halfHouseWidth + 2},${houseOffset + 13}`;
        let point6: string = `${this.streetOffset / 2 + scaleDatumIncome - roofX + 1},${houseOffset + 13}`;
        let point7: string = `${this.streetOffset / 2 + scaleDatumIncome - roofX + 1},${houseOffset + 28}`;

        return !datum ? void 0 : `${point1} ${point2} ${point3} ${point4} ${point5} ${point6} ${point7}`;
      })
      .attr('stroke-width', 1)
      /*.attr('stroke', (datum: any): any => {
        return !datum ? void 0 : fillsOfBorders[datum.region];
      })
      .style('fill', (datum: any): any => {
        return !datum ? void 0 : fills[datum.region];
      })*/
      .style('fill', '#aaacb0');

    return this;
  };

  public drawHoverHouse(place: any, gray: boolean = false): this {
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
      .attr('points', (datum: any): any => {
        let point1: string;
        let point2: string;
        let point3: string;
        let point4: string;
        let point5: string;
        let point6: string;
        let point7: string;

        if (datum) {
          let scaleDatumIncome = this.scale(datum.income);
          point1 = `${scaleDatumIncome + this.streetOffset / 2 + roofX },${this.halfOfHeight}`;
          point2 = `${scaleDatumIncome + this.streetOffset / 2 + roofX},${roofY}`;
          point3 = `${scaleDatumIncome + this.streetOffset / 2 - halfHouseWidth},${roofY}`;
          point4 = `${scaleDatumIncome + this.streetOffset / 2 },${this.halfOfHeight - 26 - 1}`;
          point5 = `${scaleDatumIncome + this.streetOffset / 2 + halfHouseWidth },${roofY}`;
          point6 = `${scaleDatumIncome + this.streetOffset / 2 - roofX },${roofY}`;
          point7 = `${scaleDatumIncome + this.streetOffset / 2 - roofX },${this.halfOfHeight}`;
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

  public clearSvg(): this {
    this.svg.selectAll('*').remove();

    return this;
  };
}
