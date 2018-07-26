export const SVG_DEFAULTS = {
  backgroungHomes: {
    name: '#icon-homes',
    width: 16,
    height: 15,
    fill: 'rgba(207,210,214,0.5)',
    positionY: 14
  },
  activeHomes: {
    name: '#icon-homes',
    width: 21,
    height: 19,
    fill: '#4B5762',
    positionY: 10
  },
  hoverHomes: {
    name: '#icon-homes',
    width: 28,
    height: 25,
    fill: '#1E2326',
    positionY: 4,
    differenceSizeHover: 14,
    text: {
      width: 60,
      height: 15,
      fill: '#232B31',
      positionY: 56,
      styles: 'font-size: 16px;',
    },
    textBg: {
      name: '#hover-bg',
      width: 68,
      height: 26,
      fill: '#ffffff',
      stroke: '#232B31',
      opacity: 0.9,
      positionY: 37,
      strokeWidth: 1.4,
      widthBySymbol: 15,
    }
  },
  road: {
    line: {
      color: '#1E2326',
      height: 2,
    },
    height: 14,
    positionY: 28,
    background: '#B2B6BB',
    color: '#ffffff',
    opacity: '0.8',
    overlay: {
      height: 23
    }
  },
  levels: {
    color: '#767d86',
    colorToHide: '#ffffff',
    positionY: 63
  },
  sliders: {
    color: '#232B31',
    name: '#slider',
    width: 32,
    height: 50,
    positionY: 15,
    differentSize: 5,
    moreThenNeed: 13,
    strokeWidth: 2,
    strokeColor: '#ffffff',
    filter: '#dropshadow',
    leftSliderMargin: -15,
    rightSliderMargin: 15,
    gaps: 40,
  },
  squarePoints: {
    name: '#square',
    width: 16,
    height: 16,
    positionY: 36,
    color: '#232B31',
  },
  mobileWidth: 700,
  minSliderSpace: 40,
  factorTimeUnits: {
    month: 1,
    week: 0.25,
    day: 0.03333,
    year: 12
  }
};
