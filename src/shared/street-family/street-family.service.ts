import { Injectable } from '@angular/core';
import { DrawDividersInterface, BrowserDetectionService } from '../../common';
import { scaleLog } from 'd3-scale';
import { select } from 'd3-selection';
import { SVG_DEFAULTS } from '../street/svg-parameters';
import { Place } from '../../interfaces';
import { get } from 'lodash';
import { DefaultUrlParameters } from '../../defaultState';

@Injectable()
export class StreetFamilyDrawService {
  public width: number;
  public height: number;
  public halfOfHeight: number;
  public streetOffset = 60;
  public chosenPlaces: Place[];
  public scale: any;
  public axisLabel: number[] = [];
  public svg: any;
  public hoverPlace: Place;
  public windowInnerWidth: number = window.innerWidth;
  public device: BrowserDetectionService;
  public isDesktop: boolean;
  public isMobile: boolean;

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
      .domain([
        get(drawDividers, 'poor', Number(DefaultUrlParameters.lowIncome)),
        get(drawDividers, 'rich', Number(DefaultUrlParameters.highIncome))
      ])
      .range([0, this.width]);

    return this;
  }

  public set setSvg(element: HTMLElement) {
    this.svg = select(element);
  }

  public drawRoad(drawDividers: DrawDividersInterface): this {
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
      .style('fill', SVG_DEFAULTS.road.background);

    this.svg
      .append('line')
      .attr('class', 'axis')
      .attr('height', SVG_DEFAULTS.road.line.height)
      .attr('x1', 1)
      .attr('y1', this.halfOfHeight + 11.5)
      .attr('x2', this.width + this.streetOffset - 1)
      .attr('y2', this.halfOfHeight + 11.5)
      .attr('stroke-width', SVG_DEFAULTS.road.line.height)
      .attr('stroke', SVG_DEFAULTS.road.line.color);

    this.svg
      .append('line')
      .attr('class', 'dash')
      .attr('x1', 24)
      .attr('y1', this.halfOfHeight + 4)
      .attr('x2', this.width + this.streetOffset - 9)
      .attr('y2', this.halfOfHeight + 3)
      .attr('stroke-dasharray', '17')
      .attr('stroke-width', 2)
      .attr('stroke', 'white');

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

    this.isDrawDividers(drawDividers);

    return this;
  }

  public drawHouse(place: Place): this {
    if (!place) {
      return this;
    }

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
        const positionX = this.scale(this.streetOffset / 2) - SVG_DEFAULTS.hoverHomes.width / 2 + scaleDatumIncome;

        return positionX;
      });

    return this;
  };

  public clearSvg(): this {
    this.svg.selectAll('*').remove();

    return this;
  };

  public isDrawDividers(drawDividers: DrawDividersInterface): this {
    if (!get(drawDividers, 'showDividers', false)) {
      return;
    }

    this.svg.selectAll('use.square-point')
      .data(this.axisLabel)
      .enter()
      .append('use')
      .attr('xlink:href', SVG_DEFAULTS.squarePoints.name)
      .attr('fill', SVG_DEFAULTS.squarePoints.color)
      .attr('class', 'square-point')
      .attr('width', SVG_DEFAULTS.squarePoints.width)
      .attr('height', SVG_DEFAULTS.squarePoints.height)
      .attr('y', SVG_DEFAULTS.squarePoints.positionY)
      .attr('x', (d: number) => {
        const x = this.scale(d);

        return x;
      });

    return this;
  }
}
