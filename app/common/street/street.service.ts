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
    this.hoverOnScalePoint(this.whatIsIncome(Math.round(positionX)), cb);
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
        return this.scale(d.income)
      })
      .attr('y', `${0.5 * this.height - 11}`)
      .attr('width', 8)
      .attr('height', 7)
      .style('fill', '#cfd2d6');


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
      .attr('stroke', '#374551');

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
    // .removeCircles('hover');
    let places = _.filter(this.places, (place:any) => {
      return place.income === d.income;
    });
    if (places.length === 1) {
      this.set('hoverPlace', places[0])
      // .drawHoverCircle(places[0]);
    }
    let options = {
      places: places,
      left: this.scale(d.income),
    };
    cb(options);
    this.drawLineOfHouses(places);
  };

  public drawTablesOfHouses(places, selector):this {
    let income = places[0].income;
    let colors = this.getFills();
    let fills = colors.fills;
    let fillsOfBorders = colors.fillsOfBorders;
    this.svg
      .append('g')
      .attr('class', selector);

    let g = this.svg
      .selectAll('g.' + selector);

    g.selectAll('polygon')
      .data(places)
      .enter()
      .append('polygon')
      .attr('points', (datum, i)=> {
        let point1, point2, point3, point4, point5, point6, point7;
        if (datum) {
          point1 = 3 + i * 21 + ',' + 22;
          point2 = 3 + i * 21 + ',' + 10;
          point3 = 3 + i * 21 - 2 + ',' + 10;
          point4 = 3 + i * 21 + 7.5 + ',' + 0;
          point5 = 3 + i * 21 + 17 + ',' + 10;
          point6 = 3 + i * 21 + 15 + ',' + 10;
          point7 = 3 + i * 21 + 15 + ',' + 22;
        }
        return !datum ? void 0 : point1 + ' ' + point2 + ' ' +
        point3 + ' ' + point4 + ' ' + point5 + ' ' + point6 + ' ' + point7;
      })
      .attr('stroke-width', (house)=> {
        if (!this.hoverPlace || this.hoverPlace && house._id === this.hoverPlace._id) {
          return 1;
        }
        return 0;
      })
      .attr('stroke', (datum)=> {
        return !datum ? void 0 : fillsOfBorders[datum.region];
      })
      .style('fill', (datum) => {
        return !datum ? void 0 : fills[datum.region];
      })
      .attr('fill-opacity', (house) => {
        if (!this.hoverPlace || this.hoverPlace && house._id === this.hoverPlace._id) {
          return 1;
        }
        return 0.3;
      });

    let width = g.node().getBBox().width;
    g.append('line')
      .attr('class', selector)
      .attr('x1', 0)
      .attr('y1', 25)
      .attr('x2', width)
      .attr('y2', 25)
      .attr('stroke-width', 1)
      .attr('stroke', '#DADADA');

    g.selectAll('polygon.arrow')
      .data([0.5 * width])
      .enter()
      .append('polygon')
      .attr('class', 'arrow')
      .attr('points', (datum) => {
        let point1, point2, point3;

        if (datum) {
          point1 = datum - 4 + ',' + 25;
          point2 = datum + 4 + ',' + 25;
          point3 = datum + ',' + 29;
        }
        return !datum ? void 0 : point1 + ' ' + point2 + ' ' + point3;
      })
      .attr('fill', '#DADADA');
    g.attr('transform', 'translate(' + (this.scale(income) - 0.5 * width) + ',' + 8 + ')');
    return this;
  };

  public drawLineOfHouses(places):this {
    let uniqIncomeArr = _.chain(places)
      .map('income')
      .uniq()
      .value();
    let emptyPlaceArr = _.map(uniqIncomeArr, () => {
      return [];
    });
    _.forEach(places, (place:any) => {
      emptyPlaceArr[uniqIncomeArr.indexOf(place.income)].push(place);
    });
    let singleHomes = _.chain(emptyPlaceArr)
      .filter((homes)=> {
        return homes.length === 1;
      })
      .map((place)=> {
        return place[0];
      })
      .value();
    let tablesHouses = _.filter(emptyPlaceArr, (homes) => {
      return homes.length > 1;
    });
    this.drawHouses(singleHomes);
    _.forEach(tablesHouses, (tableHouses)=> {
      this.drawTablesOfHouses(tableHouses, 'chosen');
    }, this);
    return this;
  };

  public drawHouses(places):this {
    let colors = this.getFills();
    let fills = colors.fills;
    let fillsOfBorders = colors.fillsOfBorders;
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
          point5 = this.scale(datum.income)  + 0.5 * houseWidth + ',' + (0.5 * this.height - 11 );
          point6 = this.scale(datum.income) -2+ 0.5 * houseWidth + ',' + (0.5 * this.height - 11 );
          point7 = this.scale(datum.income) -2+ 0.5 * houseWidth + ',' + (0.5 * this.height );
        }

        return !datum ? void 0 : point1 + ' ' + point2 + ' ' +
        point3 + ' ' + point4 + ' ' + point5 + ' ' + point6 + ' ' + point7;
      })
      .attr('stroke-width', (house) => {
        if (!this.hoverPlace) {
          return 1
        }
        if (house._id === this.hoverPlace._id) {
          return 1;
        }
        return 0;
      })
      .attr('stroke', '#98a5b0')
      .style('fill', '#a9b3bc')

    // .style('fill', (datum) => {
    //   return !datum ? void 0 : fills[datum.region];
    // })
    // .attr('fill-opacity', (house) => {
    //   if (!this.hoverPlace) {
    //     return 1
    //   }
    //   if (house._id === this.hoverPlace._id) {
    //     return 1;
    //   }
    //   return 0.3;
    //
    // });
    return this;
  };

  public drawHoverHouse(place):this {
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
          point5 = this.scale(datum.income)  + 0.5 * houseWidth + ',' + (0.5 * this.height - 14 );
          point6 = this.scale(datum.income) -2+ 0.5 * houseWidth + ',' + (0.5 * this.height - 14 );
          point7 = this.scale(datum.income) -2+ 0.5 * houseWidth + ',' + (0.5 * this.height + 0 );
        }

        return !datum ? void 0 : point1 + ' ' + point2 + ' ' +
        point3 + ' ' + point4 + ' ' + point5 + ' ' + point6 + ' ' + point7;
      })
      .attr('stroke-width', 1)
      .attr('stroke', (datum)=> {
        return !datum ? void 0 : fillsOfBorders[datum.region];
      })
      .style('fill', (datum) => {
        return !datum ? void 0 : fills[datum.region];
      })
      .attr('fill-opacity', 1);
    return this;
  };

  // public drawCircles(places):this {
  //   let colors = this.getFills();
  //   let fills = colors.fills;
  //   let fillsOfBorders = colors.fillsOfBorders;
  //   this.svg
  //     .selectAll('circle.chosen')
  //     .data(places)
  //     .enter()
  //     .append('circle')
  //     .attr('class', 'chosen')
  //     .attr('cx', (d)=> {
  //       return !d ? void 0 : this.scale(d.income);
  //     })
  //     .attr('cy', 0.5 * this.height + 15)
  //     .attr('r', (d) => {
  //       return !d ? void 0 : 5.5;
  //     })
  //     .attr('stroke-width', (house)=> {
  //       if (!this.hoverPlace) {
  //         return 1
  //       }
  //       if (house._id === this.hoverPlace._id) {
  //         return 1;
  //       }
  //       return 0;
  //     })
  //     .attr('stroke', (datum, i)=> {
  //       if (!datum) {
  //         return void 0;
  //       }
  //       if (places[i + 1] && datum && places[i + 1].income === datum.income ||
  //         places[i - 1] && datum && places[i - 1].income === datum.income) {
  //         return '#52606b';
  //       }
  //       return fillsOfBorders[datum.region];
  //     })
  //     .style('fill', (datum, i) => {
  //       if (!datum) {
  //         return void 0;
  //       }
  //
  //       let fill = fills[datum.region];
  //
  //       if (places[i + 1] && datum && places[i + 1].income === datum.income ||
  //         places[i - 1] && datum && places[i - 1].income === datum.income) {
  //         fill = '#52606b';
  //       }
  //
  //       return fill;
  //     });
  //   return this;
  // };

  // public drawHoverCircle(hoverPlace):this {
  //   let colors = this.getFills();
  //   let fills = colors.fills;
  //   let fillsOfBorders = colors.fillsOfBorders;
  //   this.svg
  //     .selectAll('circle.hover')
  //     .data([hoverPlace])
  //     .enter()
  //     .append('circle')
  //     .attr('class', 'hover')
  //     .attr('cx', (d) => {
  //       return this.scale(d.income);
  //     })
  //     .attr('cy', 0.5 * this.height + 15)
  //     .attr('r', (d) => {
  //       return !d ? void 0 : 5.5;
  //     })
  //     .attr('stroke-width', 1)
  //     .attr('stroke', (datum)=> {
  //       return !datum ? void 0 : fillsOfBorders[datum.region];
  //     })
  //     .style('fill', (datum) => {
  //       return !datum ? void 0 : fills[datum.region];
  //     });
  //
  //   //this.svg.selectAll('circle.chosen').attr('fill-opacity', 0.5);
  //   //this.svg.selectAll('circle.point').attr('fill-opacity', 0.5);
  //   return this;
  // };

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

  public clearAndRedraw(places):this {
    this.removeHouses('hover')
      //.removeCircles('hover')
      .removeHouses('chosen')
    // .removeCircles('chosen');
    if (places) {
      this.drawLineOfHouses(places)
      // .drawCircles(places);
    }
    return this;
  };

  // public removeCircles(selector):this {
  //   this.svg.selectAll('circle.' + selector).remove('circle.' + selector);
  //   this.svg.selectAll('circle.point').attr('fill-opacity', 1);
  //   return this;
  // };

  public removeHouses(selector):this {
    this.svg.selectAll('rect.' + selector).remove('rect.' + selector);
    this.svg.selectAll('polygon.' + selector).remove('polygon.' + selector);
    this.svg.selectAll('g.' + selector).remove('polygon.' + selector);
    // this.svg.selectAll('circle.point').attr('fill-opacity', 1);

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
