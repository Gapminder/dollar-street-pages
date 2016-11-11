import { Injectable } from '@angular/core';
import { DrawDividersInterface, BrowserDetectionService } from '../../common';
import { scaleLog } from 'd3-scale';
import { select } from 'd3-selection';

@Injectable()
export class StreetFamilyDrawService {
  public width: number;
  public height: number;
  public halfOfHeight: number;
  public streetOffset: number = 60;
  public chosenPlaces: any;
  public scale: any;
  public axisLabel: number[] = [];
  public svg: any;
  public draggingSliders: boolean = false;
  public hoverPlace: any;
  public windowInnerWidth: number = window.innerWidth;
  public device: BrowserDetectionService;
  public isDesktop: boolean;
  public isMobile: boolean;
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
      .domain([drawDividers.poor, drawDividers.low, drawDividers.medium, drawDividers.high, drawDividers.rich])
      .range([0, drawDividers.lowDividerCoord / 1000 * this.width, drawDividers.mediumDividerCoord / 1000 * this.width, drawDividers.highDividerCoord / 1000 * this.width, this.width]);

    return this;
  }

  public set setSvg(element: HTMLElement) {
    this.svg = select(element);
  }

  public drawRoad(): this {
    this.svg
      .append('polygon')
      .attr('class', 'road')
      .attr('points', () => {
        let point1: string = `0,${this.height - 3}`;
        let point2: string = `19,${this.height - 3 - 7}`;
        let point3: string = `${this.width + this.streetOffset - 19},${this.height - 3 - 7}`;
        let point4: string = `${this.width + this.streetOffset},${this.height - 3}`;

        return `${point1} ${point2} ${point3} ${point4}`;
      })
      .style('fill', '#727a82');

    this.svg
      .append('line')
      .attr('class', 'axis')
      .attr('x1', 1)
      .attr('y1', this.height - 2)
      .attr('x2', this.width + this.streetOffset - 1)
      .attr('y2', this.height - 2)

      .attr('stroke-width', 2)
      .attr('stroke', '#525c64');

    this.svg
      .append('line')
      .attr('class', 'dash')
      .attr('x1', 24)
      .attr('y1', this.height - 3 - 3.5)
      .attr('x2', this.width + this.streetOffset - 24)
      .attr('y2', this.height - 3 - 3.5)
      .attr('stroke-dasharray', '17')
      .attr('stroke-width', 1)
      .attr('stroke', 'white');

    return this;
  };

  public drawHouse(place: any): this {
    if (!place) {
      return this;
    }

    let fills = this.colors.fills;
    let fillsOfBorders = this.colors.fillsOfBorders;
    let halfHouseWidth = 10;
    let roofX = 2 - halfHouseWidth;

    this.svg
      .selectAll('polygon.hover')
      .data([place])
      .enter()
      .append('polygon')
      .attr('class', 'hover')
      .attr('points', (datum: any): any => {
        let scaleDatumIncome: number = this.scale(datum.income);

        let point1: string = `${this.streetOffset / 2 + scaleDatumIncome + roofX},20`;
        let point2: string = `${this.streetOffset / 2 + scaleDatumIncome + roofX},9`;
        let point3: string = `${this.streetOffset / 2 + scaleDatumIncome - halfHouseWidth},9`;
        let point4: string = `${this.streetOffset / 2 + scaleDatumIncome},0`;
        let point5: string = `${this.streetOffset / 2 + scaleDatumIncome + halfHouseWidth},9`;
        let point6: string = `${this.streetOffset / 2 + scaleDatumIncome - roofX},9`;
        let point7: string = `${this.streetOffset / 2 + scaleDatumIncome - roofX},20`;

        return !datum ? void 0 : `${point1} ${point2} ${point3} ${point4} ${point5} ${point6} ${point7}`;
      })
      .attr('stroke-width', 1)
      .attr('stroke', (datum: any): any => {
        return !datum ? void 0 : fillsOfBorders[datum.region];
      })
      .style('fill', (datum: any): any => {
        return !datum ? void 0 : fills[datum.region];
      });

    return this;
  };

  public clearSvg(): this {
    this.svg.selectAll('*').remove();

    return this;
  };
}
