const d3 = require('d3');
const device = require('device.js')();
const isDesktop = device.desktop();

export class StreetMiniDrawService {
  public width:number;
  public height:number;
  public halfOfHeight:number;
  public lowIncome:number = 0;
  public hightIncome:number = 15000;
  private scale:any;
  private svg:any;
  private incomeArr:any[] = [];

  private leftScroll:any;
  private rightScroll:any;
  private leftScrollOpacity:any;
  private rightScrollOpacity:any;
  private leftScrollText:any;
  private rightScrollText:any;
  private colors:{fills:any, fillsOfBorders:any} = {
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

  public init():this {
    this.width = parseInt(this.svg.style('width'), 10);
    this.height = parseInt(this.svg.style('height'), 10);
    this.halfOfHeight = 0.5 * this.height;

    this.scale = d3
      .scale.log()
      .domain([1, 30, 300, 3000, 15000])
      .range([20, 0.07 * this.width, 0.5 * this.width, 0.92 * this.width, 0.97 * this.width]);
    return this;
  }

  public set setSvg(element:HTMLElement) {
    this.svg = d3.select(element);
  }

  public set(key:any, val:any):this {
    this[key] = val;

    return this;
  };

  public drawScale(places:any):this {
    if (!places || !places.length) {
      return this;
    }

    d3.svg
      .axis()
      .scale(this.scale)
      .orient('bottom')
      .tickFormat(() => {
        return void 0;
      })
      .tickSize(6, 0);

    if (isDesktop) {
      this.svg
        .selectAll('rect.point')
        .data(places)
        .enter()
        .append('rect')
        .attr('class', 'point')
        .attr('x', (d:any):any => {
          if (!d) {
            return 0;
          }

          return this.scale(d) - 4;
        })
        .attr('y', this.halfOfHeight - 11)
        .attr('width', (d:any):any => {
          if (!d) {
            return 0;
          }

          return 8;
        })
        .attr('height', (d:any):any => {
          if (!d) {
            return 0;
          }

          return 7;
        })
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
      .attr('y1', this.halfOfHeight + 3)
      .attr('x2', this.width - 9)
      .attr('y2', this.halfOfHeight + 3)
      .attr('stroke-dasharray', '8,8')
      .attr('stroke-width', 1.5)
      .attr('stroke', 'white');

    this.incomeArr.length = 0;
    return this;
  };

  public drawHoverHouse(place:any, gray:boolean = false):this {

    if (!place) {
      return this;
    }
    let income = Math.round(place.income);
    let fills = this.colors.fills;
    let fillsOfBorders = this.colors.fillsOfBorders;
    let halfHouseWidth = 12.5;
    let roofX = 2 - halfHouseWidth;
    let roofY = this.halfOfHeight - 15;

    this.svg
      .selectAll('poligon.hover')
      .data([income])
      .enter()
      .append('text')
      .text('$ ' + income)
      .attr('x', this.scale(income) - 20)
      .attr('y', this.height - 70)
      .attr('fill', '#767d86');

    this.svg
      .selectAll('polygon.hover')
      .data([place])
      .enter()
      .append('polygon')
      .attr('class', 'hover')
      .attr('points', (datum:any):any => {
        let point1;
        let point2;
        let point3;
        let point4;
        let point5;
        let point6;
        let point7;

        if (datum) {
          let scaleDatumIncome = this.scale(datum.income);
          point1 = `${scaleDatumIncome + roofX },${this.halfOfHeight - 1}`;
          point2 = `${scaleDatumIncome + roofX},${roofY}`;
          point3 = `${scaleDatumIncome - halfHouseWidth},${roofY}`;
          point4 = `${scaleDatumIncome},${this.halfOfHeight - 26}`;
          point5 = `${scaleDatumIncome + halfHouseWidth },${roofY}`;
          point6 = `${scaleDatumIncome - roofX },${roofY}`;
          point7 = `${scaleDatumIncome - roofX },${this.halfOfHeight - 1}`;
        }

        return !datum ? void 0 : point1 + ' ' + point2 + ' ' +
        point3 + ' ' + point4 + ' ' + point5 + ' ' + point6 + ' ' + point7;
      })
      .attr('stroke-width', 1)
      .attr('stroke', (datum:any):any => {
        if (gray) {
          return '#303e4a';
        }

        return !datum ? void 0 : fillsOfBorders[datum.region];
      })
      .style('fill', (datum:any):any => {
        if (gray) {
          return '#374551';
        }

        return !datum ? void 0 : fills[datum.region];
      });

    return this;
  };

  public clearAndRedraw(places:any, slider:boolean = false):this {
    if (!places || !places.length && !slider) {
      this.removeHouses('hover');
      this.removeHouses('chosen');

      return this;
    }

    this.removeHouses('hover');
    this.removeHouses('chosen');

    if (slider) {
      this.drawHoverHouse(places);

      return;
    }

    this.drawHouses(places);

    return this;
  };

  public removeHouses(selector:any):this {
    this.svg.selectAll('rect.' + selector).remove('rect.' + selector);
    this.svg.selectAll('polygon.' + selector).remove('polygon.' + selector);

    if (selector === 'chosen') {
      this.svg.selectAll('polygon.chosenLine').remove('polygon.chosenLine');
    }

    return this;
  };

  public clearSvg():this {
    this.leftScroll = void 0;
    this.rightScroll = void 0;
    this.leftScrollOpacity = void 0;
    this.rightScrollOpacity = void 0;
    this.leftScrollText = void 0;
    this.rightScrollText = void 0;
    this.hightIncome = 15000;
    this.lowIncome = 0;
    this.svg.selectAll('*').remove('*');

    return this;
  };

  private drawHouses(places:any):this {
    if (!places || !places.length) {
      return this;
    }

    let halfHouseWidth = 10;
    let roofX = 2 - halfHouseWidth;
    let roofY = this.halfOfHeight - 12;

    this.svg.selectAll('polygon.chosen')
      .data(places)
      .enter()
      .append('polygon')
      .attr('class', 'chosen')
      .attr('points', (datum:any):any => {
        let point1;
        let point2;
        let point3;
        let point4;
        let point5;
        let point6;
        let point7;

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
}
