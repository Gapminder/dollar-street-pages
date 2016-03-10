const d3 = require('d3');
let device = require('device.js')();
const isDesktop = device.desktop();

export class StreetDrawService {
  private places = [];
  private poorest = 'Poorest 1$';
  private richest = 'Richest';
  private width:number;
  private height:number;
  private scale:any;
  private axisLabel = [10, 100];
  private svg:any;
  private incomeArr = [];
  private fullIncomeArr = [];
  private hoverPlace:any = null;

  constructor(element:HTMLElement) {
    this.svg = d3.select(element);
  }

  public init():this {
    this.width = parseInt(this.svg.style('width'), 10);
    this.height = parseInt(this.svg.style('height'), 10);
    this.scale = d3
      .scale.log()
      .domain([1, 10, 100, 10000])
      .range([0.07 * this.width, 0.375 * this.width, 0.75 * this.width, 0.97 * this.width]);
    return this;
  }

  public set(key, val):this {
    this[key] = val;
    return this;
  };

  public onSvgHover(positionX, cb) {
    this.hoverOnScalePoint(this.whatIsIncome(Math.round(positionX-15)), cb);
  };

  public whatIsIncome(positionX):any {
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
      .attr('x', 15)
      .attr('y', this.height)
      .attr('fill', '#767d86');

    this.svg
      .selectAll('text.richest')
      .data([this.richest])
      .enter()
      .append('text')
      .attr('class', 'richest')
      .text(this.richest)
      .attr('x', this.width - 55)
      .attr('y', this.height)
      .attr('fill', '#767d86');


    this.svg
      .selectAll('rect.point')
      .data(places)
      .enter()
      .append('rect')
      .attr('class', 'point')
      .attr('x', (d)=> {
        return this.scale(d.income) - 4;
      })
      .attr('y', `${0.5 * this.height - 11}`)
      .attr('width', 8)
      .attr('height', 7)
      .style('fill', '#cfd2d6')
      .style('opacity', '0.7');


    this.svg
      .append('polygon')
      .attr('class', 'road')
      .attr('points', () => {
        let point1 = `0,${0.5 * this.height + 14}`;
        let point2 = `9,${0.5 * this.height - 4}`;
        let point3 = `${ this.width - 9},${0.5 * this.height - 4}`;
        let point4 = `${ this.width},${0.5 * this.height + 14}`;
        return `${point1} ${point2} ${point3} ${point4}`
      })
      .style('fill', '#5f6a74')

    this.svg
      .append('line')
      .attr('class', 'axis')
      .attr('x1', 0)
      .attr('y1', 0.5 * this.height + 15)
      .attr('x2', this.width)
      .attr('y2', 0.5 * this.height + 15)
      .attr('stroke-width', 3)
      .attr('stroke', '#374551')

    this.svg
      .append('line')
      .attr('class', 'dash')
      .attr('x1', 18)
      .attr('y1', `${0.5 * this.height + 5}`)
      .attr('x2', `${ this.width - 9}`)
      .attr('y2', `${0.5 * this.height + 5}`)
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
      .attr('y', this.height)
      .attr('fill', '#767d86');

    return this;
  };

  public hoverOnScalePoint(d, cb):void {
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
        .drawHoverHouse(places[0])
    } else {

      this.set('hoverPlace', places[0])
        .drawHoverHouse(places[0],true)
    }
    let options = {
      places: places,
      left: this.scale(d.income),
    };
    cb(options);
  };
  

  public drawHouses(places):this {
    let houseWidth = 19;
    this.svg.selectAll('polygon.chosen')
      .data(places)
      .enter()
      .append('polygon')
      .attr('class', 'chosen')
      .attr('points', (datum)=> {
        let point1, point2, point3, point4, point5, point6, point7;
        if (datum) {
          point1 = this.scale(datum.income) + 2 - 0.5 * houseWidth + ',' + (0.5 * this.height);
          point2 = this.scale(datum.income) + 2 - 0.5 * houseWidth + ',' + (0.5 * this.height - 11);
          point3 = this.scale(datum.income) - 0.5 * houseWidth + ',' + (0.5 * this.height - 11 );
          point4 = this.scale(datum.income) + ',' + (0.5 * this.height - 19);
          point5 = this.scale(datum.income) + 0.5 * houseWidth + ',' + (0.5 * this.height - 11 );
          point6 = this.scale(datum.income) - 2 + 0.5 * houseWidth + ',' + (0.5 * this.height - 11 );
          point7 = this.scale(datum.income) - 2 + 0.5 * houseWidth + ',' + (0.5 * this.height );
        }

        return !datum ? void 0 : point1 + ' ' + point2 + ' ' +
        point3 + ' ' + point4 + ' ' + point5 + ' ' + point6 + ' ' + point7;
      })
      .attr('stroke', '#98a5b0')
      .style('fill', '#a9b3bc');
    return this;
  };

  public drawHoverHouse(place,gray=false):this {
    let colors = this.getFills();
    let fills = colors.fills;
    let fillsOfBorders = colors.fillsOfBorders;
    let houseWidth = 23;
    this.svg.selectAll('polygon.hover')
      .data([place])
      .enter()
      .append('polygon')
      .attr('class', 'hover')
      .attr('points', (datum)=> {
        let point1, point2, point3, point4, point5, point6, point7;
        if (datum) {
          point1 = this.scale(datum.income) + 2 - 0.5 * houseWidth + ',' + (0.5 * this.height + 0);
          point2 = this.scale(datum.income) + 2 - 0.5 * houseWidth + ',' + (0.5 * this.height - 14);
          point3 = this.scale(datum.income) - 0.5 * houseWidth + ',' + (0.5 * this.height - 14 );
          point4 = this.scale(datum.income) + ',' + (0.5 * this.height - 23);
          point5 = this.scale(datum.income) + 0.5 * houseWidth + ',' + (0.5 * this.height - 14 );
          point6 = this.scale(datum.income) - 2 + 0.5 * houseWidth + ',' + (0.5 * this.height - 14 );
          point7 = this.scale(datum.income) - 2 + 0.5 * houseWidth + ',' + (0.5 * this.height + 0 );
        }

        return !datum ? void 0 : point1 + ' ' + point2 + ' ' +
        point3 + ' ' + point4 + ' ' + point5 + ' ' + point6 + ' ' + point7;
      })
      .attr('stroke-width', 1)
      .attr('stroke', (datum)=> {
        if(gray){
          return '#98a5b0'
        }
        return !datum ? void 0 : fillsOfBorders[datum.region];
      })
      .style('fill', (datum) => {
        if(gray){
          return '#a9b3bc'
        }
        return !datum ? void 0 : fills[datum.region];
      })
    return this;
  };

  public getFills() {
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

  public clearAndRedraw(places,slider=false):this {
    this.removeHouses('hover')
      .removeHouses('chosen');
      if(slider){
        this.drawHoverHouse(places[0]);
        return
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
