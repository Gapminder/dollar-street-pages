const d3 = require('d3');
const _ = require('lodash');
const device = require('device.js')();
const isDesktop = device.desktop();

export class StreetDrawService {
  private places = [];
  private poorest = 'Poorest 1$';
  private richest = 'Richest';
  private width:number;
  private height:number;
  private halfOfHeight:number;
  private scale:any;
  private axisLabel = [10, 100];
  private svg:any;
  private incomeArr = [];
  private fullIncomeArr = [];
  private hoverPlace:any = null;

  public init():this {
    this.width = parseInt(this.svg.style('width'), 10);
    this.height = parseInt(this.svg.style('height'), 10);
    this.halfOfHeight = 0.5 * this.height;

    this.scale = d3
      .scale.log()
      .domain([1, 10, 100, 10000])
      .range([0.07 * this.width, 0.375 * this.width, 0.75 * this.width, 0.97 * this.width]);

    return this;
  }

  set setSvg(element:HTMLElement) {
    this.svg = d3.select(element);
  }

  public set(key, val):this {
    this[key] = val;

    return this;
  };

  public onSvgHover(positionX, cb) {
    this.hoverOnScalePoint(this.whatIsIncome(Math.round(positionX - 15)), cb);
  };

  protected whatIsIncome(positionX):any {
    let index = _.sortedIndex(this.fullIncomeArr, positionX);
    let indexL = index - 1;

    if (indexL <= 0) {
      return _.first(this.places);
    }

    if (index >= this.fullIncomeArr.length) {
      return _.last(this.places);
    }

    let right = this.scale(this.places[index].income) - positionX;
    let left = this.scale(this.places[indexL].income) - positionX;

    if (Math.abs(right) > Math.abs(left)) {
      return this.places[indexL];
    }

    return this.places[index];
  };

  public drawScale(places) {
    d3.svg
      .axis().scale(this.scale)
      .orient('bottom')
      .tickFormat(() => {
        return null;
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
      .attr('y', this.height - 5)
      .attr('fill', '#767d86');

    this.svg
      .selectAll('text.richest')
      .data([this.richest])
      .enter()
      .append('text')
      .attr('class', 'richest')
      .text(this.richest)
      .attr('x', this.width - 40)
      .attr('y', this.height - 5)
      .attr('fill', '#767d86');

    if (isDesktop) {
      this.svg
        .selectAll('rect.point')
        .data(places)
        .enter()
        .append('rect')
        .attr('class', 'point')
        .attr('x', (d) => {
          return this.scale(d.income) - 4;
        })
        .attr('y', `${this.halfOfHeight - 11}`)
        .attr('width', 8)
        .attr('height', 7)
        .style('fill', '#cfd2d6')
        .style('opacity', '0.7');
    }

    this.svg
      .append('polygon')
      .attr('class', 'road')
      .attr('points', () => {
        let point1 = `0,${ this.halfOfHeight + 9}`;
        let point2 = `15,${ this.halfOfHeight - 4}`;
        let point3 = `${ this.width - 15},${ this.halfOfHeight - 4}`;
        let point4 = `${ this.width},${ this.halfOfHeight + 9}`;

        return `${point1} ${point2} ${point3} ${point4}`;
      })
      .style('fill', '#737b83');

    this.svg
      .append('line')
      .attr('class', 'axis')
      .attr('x1', 0)
      .attr('y1', this.halfOfHeight + 10)
      .attr('x2', this.width)
      .attr('y2', this.halfOfHeight + 10)
      .attr('stroke-width', 2)
      .attr('stroke', '#505b65');

    this.svg
      .append('line')
      .attr('class', 'dash')
      .attr('x1', 18)
      .attr('y1', `${ this.halfOfHeight + 3}`)
      .attr('x2', `${ this.width - 9}`)
      .attr('y2', `${ this.halfOfHeight + 3}`)
      .attr('stroke-dasharray', '8,8')
      .attr('stroke-width', 1.5)
      .attr('stroke', 'white');

    this.incomeArr.length = 0;

    this.svg
      .selectAll('text.scale-label')
      .data(this.axisLabel)
      .enter()
      .append('text')
      .attr('class', 'scale-label')
      .text((d) => {
        return d + '$';
      })
      .attr('x', (d) => {
        let indent = 0;

        if ((d + '').length === 2) {
          indent = 11;
        }

        if ((d + '').length === 3) {
          indent = 15;
        }

        return this.scale(d) - indent;
      })
      .attr('y', this.height - 5)
      .attr('fill', '#767d86');

    return this;
  };

  protected hoverOnScalePoint(d, cb):void {
    if (!d) {
      return;
    }

    this
      .set('hoverPlace', null)
      .removeHouses('chosen')
      .removeHouses('hover');

    let places = _.filter(this.places, (place:any) => {
      return place.income === d.income;
    });

    if (places.length === 1) {
      this.set('hoverPlace', places[0])
        .drawHoverHouse(places[0]);
    } else {
      this.set('hoverPlace', places[0])
        .drawHoverHouse(places[0], true);
    }

    let options = {
      places: places,
      left: this.scale(d.income)
    };

    cb(options);
  };

  public drawHouses(places):this {
    let halfHouseWidth = 10;
    let roofX = 2 - halfHouseWidth;
    let roofY = this.halfOfHeight - 12;

    this.svg.selectAll('polygon.chosen')
      .data(places)
      .enter()
      .append('polygon')
      .attr('class', 'chosen')
      .attr('points', (datum) => {
        let point1, point2, point3, point4, point5, point6, point7;

        if (datum) {
          let scaleDatumIncome = this.scale(datum.income);
          point1 = `${ scaleDatumIncome + roofX},${this.halfOfHeight - 1}`;
          point2 = `${scaleDatumIncome + roofX},${roofY}`;
          point3 = `${scaleDatumIncome - halfHouseWidth },${roofY}`;
          point4 = `${scaleDatumIncome },${ this.halfOfHeight - 21}`;
          point5 = `${scaleDatumIncome + halfHouseWidth },${roofY}`;
          point6 = `${scaleDatumIncome - roofX },${ roofY}`;
          point7 = `${scaleDatumIncome - roofX },${ this.halfOfHeight - 1}`;
        }

        return !datum ? void 0 : point1 + ' ' + point2 + ' ' +
        point3 + ' ' + point4 + ' ' + point5 + ' ' + point6 + ' ' + point7;
      })
      .attr('stroke', '#303e4a')
      .style('fill', '#374551');

    return this;
  };

  public drawHoverHouse(place, gray = false):this {
    let colors = this.getFills();
    let fills = colors.fills;
    let fillsOfBorders = colors.fillsOfBorders;
    let halfHouseWidth = 12.5;
    let roofX = 2 - halfHouseWidth;
    let roofY = this.halfOfHeight - 15;

    this.svg.selectAll('polygon.hover')
      .data([place])
      .enter()
      .append('polygon')
      .attr('class', 'hover')
      .attr('points', (datum) => {
        let point1, point2, point3, point4, point5, point6, point7;

        if (datum) {
          let scaleDatumIncome = this.scale(datum.income);
          point1 = `${scaleDatumIncome + roofX },${ this.halfOfHeight - 1}`;
          point2 = `${scaleDatumIncome + roofX},${roofY}`;
          point3 = `${scaleDatumIncome - halfHouseWidth },${roofY}`;
          point4 = `${scaleDatumIncome },${this.halfOfHeight - 26}`;
          point5 = `${scaleDatumIncome + halfHouseWidth },${roofY}`;
          point6 = `${scaleDatumIncome - roofX },${roofY}`;
          point7 = `${scaleDatumIncome - roofX },${this.halfOfHeight - 1}`;
        }

        return !datum ? void 0 : point1 + ' ' + point2 + ' ' +
        point3 + ' ' + point4 + ' ' + point5 + ' ' + point6 + ' ' + point7;
      })
      .attr('stroke-width', 1)
      .attr('stroke', (datum) => {
        if (gray) {
          return '#98a5b0';
        }

        return !datum ? void 0 : fillsOfBorders[datum.region];
      })
      .style('fill', (datum) => {
        if (gray) {
          return '#a9b3bc';
        }

        return !datum ? void 0 : fills[datum.region];
      });

    return this;
  };

  protected getFills() {
    return {
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
  };

  public clearAndRedraw(places, slider = false):this {
    this.removeHouses('hover')
      .removeHouses('chosen');

    if (slider) {
      this.drawHoverHouse(places[0]);

      return;
    }

    this.drawHouses(places);

    return this;
  };

  public removeHouses(selector):this {
    this.svg.selectAll('rect.' + selector).remove('rect.' + selector);
    this.svg.selectAll('polygon.' + selector).remove('polygon.' + selector);

    if (selector === 'chosen') {
      this.svg.selectAll('polygon.chosenLine').remove('polygon.chosenLine');
    }

    return this;
  };

  public clearSvg():this {
    this.svg.selectAll('*').remove('*');

    return this;
  };
}
