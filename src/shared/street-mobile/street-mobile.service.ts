import { DrawDividersInterface } from '../../common';
import { Injectable } from '@angular/core';

import { select } from 'd3-selection';
import { scaleLog } from 'd3-scale';

@Injectable()
export class StreetMobileDrawService {
  public width: number;
  public height: number;
  public halfOfHeight: number;
  public streetOffset: number;
  private scale: any;
  private svg: any;

  public init(drawDividers: DrawDividersInterface): this {
    this.streetOffset = 60;
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

  public drawScale(places: any): this {
    let halfHouseWidth = 7;
    let roofX = 2 - halfHouseWidth;
    let roofY = this.halfOfHeight - 10;

    if (!places || !places.length) {
      return this;
    }

    this.svg
      .selectAll('polygon')
      .data(places)
      .enter()
      .append('polygon')
      .attr('class', 'point')
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
          point1 = `${this.streetOffset / 2 + scaleDatumIncome + roofX},${this.halfOfHeight - 4}`;
          point2 = `${this.streetOffset / 2 + scaleDatumIncome + roofX},${roofY}`;
          point3 = `${this.streetOffset / 2 + scaleDatumIncome - halfHouseWidth},${roofY}`;
          point4 = `${this.streetOffset / 2 + scaleDatumIncome},${this.halfOfHeight - 17}`;
          point5 = `${this.streetOffset / 2 + scaleDatumIncome + halfHouseWidth },${roofY}`;
          point6 = `${this.streetOffset / 2 + scaleDatumIncome - roofX},${roofY}`;
          point7 = `${this.streetOffset / 2 + scaleDatumIncome - roofX},${this.halfOfHeight - 4}`;
        }

        return !datum ? void 0 : point1 + ' ' + point2 + ' ' +
        point3 + ' ' + point4 + ' ' + point5 + ' ' + point6 + ' ' + point7;
      })
      .attr('stroke-width', 1)
      .style('fill', '#cfd2d6')
      .style('opacity', '0.7');

    return this;
  };

  public clearSvg(): this {
    this.svg.selectAll('*').remove();

    return this;
  };
}
