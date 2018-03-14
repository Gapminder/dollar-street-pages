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
    fill: '#1E2326',
    positionY: 10
  },
  hoverHomes: {
    name: '#icon-homes',
    width: 28,
    height: 25,
    fill: '#1E2326',
    positionY: 5,
    differenceSizeHover: 14,
    text: {
      width: 60,
      height: 15,
      fill: '#374551',
      positionY: 50,
      styles: 'font-size: 13px;',
    },
    textBg: {
      name: '#hover-bg',
      width: 58,
      height: 20,
      fill: '#ffffff',
      stroke: '#374551',
      opacity: 0.9,
      positionY: 37,
      strokeWidth: 1,
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
    positionY: 61
  },
  sliders: {
    color: '#525C64',
    name: '#slider',
    width: 37,
    height: 60,
    positionY: 9,
    differentSize: 0,
    moreThenNeed: 2,
    strokeWidth: 2,
    strokeColor: '#ffffff'
  },
  squarePoints: {
    name: '#square',
    width: 18,
    height: 18,
    positionY: 35,
    color: '#232B31',
  },
  mobileWidth: 700,

};
