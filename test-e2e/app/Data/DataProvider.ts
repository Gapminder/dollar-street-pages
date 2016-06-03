'use strict';
module.exports = {
  footerTextInfo:{
    'Logo': {       logoCSS: 'p[class^="logo_name"]',   actualResult: 'DOLLAR STREET'},
    'Gapminder': {  logoCSS: 'p[class^="logo_name"]+p', actualResult: 'Powered by Gapminder'}},
  footerBooleanInfo:{
    'FacebookIcon': {   logoCSS: 'div[class="footer"] div[class*="facebook"]'},
    'TwitterIcon': {    logoCSS: 'div[class="footer"] div[class*="twitter"]'},
    'GoogleIcon': {     logoCSS: 'div[class="footer"] div[class*="google"]'},
    'LinkedinIcon': {   logoCSS: 'div[class="footer"] div[class*="linkedin"]'},
    'CreativeCommons': {logoCSS: '.col-md-3.col-sm-3.f-creative-commons>a>img'}
  },
  mainPageTextHeader: {
    'link Homes': {element: 'div[class*="menu"]>a[href*="matrix"]', actualResult: 'Homes'},
    'link Map': {element: 'div[class*="menu"]>a[href^="/map"]', actualResult: 'Map'},
    'link Photographers': {element: 'div[class*="menu"]>a[href*="photographers"]', actualResult: 'Photographers'},
    'link Ambassadors': {element: 'div[class*="menu"]>a[href*="ambassadors"]', actualResult: 'Ambassadors'}
  },
  mainPageBooleanHeader:{
    'Facebook icon': {element: 'div[class*="header"] .fa.fa-facebook'},
    'Twitter icon': {element: 'div[class*="header"] .fa.fa-twitter'},
    'Google icon': {element: 'div[class*="header"] .fa.fa-google-plus'},
    'Linkedin icon': {element: 'div[class*="header"] .fa.fa-linkedin'},
  },
  mainPageTextSubHeader:{
    'Welcome': {textCSS: 'div[class*="welcome-header"]>h1', actualResult: 'Welcome to Dollar Street'},
    'About': {textCSS: 'div[class*="about-header"]>h2', actualResult: 'ABOUT'},
    'Similarities': {textCSS: 'div[class*="similarities"]>h2', actualResult: 'SIMILARITIES'}
  },
  mainPageBooleanImages:{
    'Way with homes': {imgCSS: '.description.col-md-12>img', numberElems: 1},
    'Article content': {imgCSS: 'img[class*="article-image"]', numberElems: 3},
    'Place content': {imgCSS: '.place-content>img', numberElems: 6}
  },
  photographersPageField: {
    'Enter AJ SHARMA in Search field': {photographerQuery: 'Sharm'},
    'Enter Johan Eriksson in Search field': {photographerQuery: 'Eriks'},
    'Enter Luc Forsyth in Search field': {photographerQuery: 'Luc'},
    'Enter Amr Said  in Search field': {photographerQuery: 'Amr'},
    'Enter Ivan Guilbert in Search field': {photographerQuery: 'Iv'},
    'Enter Alisia Sidorenko in Search field': {photographerQuery: 'Alis'},
  },
  photographerPageBoolean: {
    'Name Photographer': {photographerDataCSS: '.heading'},
    'Photographer families': {photographerDataCSS: '.family>h3'},
    'Total photos by Photographer': {photographerDataCSS: '.photo'}
  },
  mapPageCountry:{
    'Country Bangladesh': {element: function ():void {return $('span[href$="55ef338d0d2b3c82037884d0"]'); }, actualResult: 'Bangladesh'},
    'Country Colombia': {element: function ():void {return $('span[href$="55ef338d0d2b3c820378846c"]'); }, actualResult: 'Colombia'},
    'Country Indonesia': {element: function ():void {return $('span[href$="55ef338d0d2b3c82037884d9"]'); }, actualResult: 'Indonesia'},
    'Country Lithuania': {element: function ():void {return $('span[href$="55ef338d0d2b3c820378844a"]'); }, actualResult: 'Lithuania'},
    'Country Rwanda': {element: function ():void {return $('span[href$="55ef338d0d2b3c82037884b9"]'); }, actualResult: 'Rwanda'},
    'Sub-title -Home on the World Map-': {element: function ():void  {return $('div[class*="search-text"]>span'); }, actualResult: 'Home on the World map'},
  },
  photographersPageSearch:{
    'Input Bangladesh in Search field': {countryQuery: 'bang'},
    'Input Bulgaria in Search field': {countryQuery: 'bulg'},
    'Input Colombia in Search field': {countryQuery: 'colomb'},
    'Input India in Search field': {countryQuery: 'indi'},
    'Input France in Search field': {countryQuery: 'fra'},
    'Input Kazakhstan in Search field': {countryQuery: 'kaza'},
    'Input Liberia in Search field': {countryQuery: 'libe'},
    'Input Mexico in Search field': {countryQuery: 'mexi'},
    'Input Turkey in Search field': {countryQuery: 'tur'},
  },
  ambassadorsPageText:{
    'H2 in header': {element: function ():void  {return $('h2[class="heading"]'); }, actualResult: 'Ambassadors'},
  },
  ambassadorsPageBoolean:{
    'Logo img in header': {element: function ():void {return $('.logo.pull-left>img'); }},
    'Menu icon in header': {element: function ():void  {return $('.menu-icon'); }}
  },
  matrixPageText:{
    'H2 -by income- in header': {element: function ():void  {return $('span[class="income-sorted"]'); }, actualResult: ' by income'},
    'Poorest header on Street Widget': {element: function ():void  {return $('text[class="poorest"]'); }, actualResult: 'Poorest 3$'},
    'Richest header on Street Widget': {element: function ():void  {return $('text[class="richest"]'); }, actualResult: 'Richest'},
    'Scale label 10 on Street Widget': {element: function ():void  {return element.all(by.css('text[class="scale-label"]')).first(); }, actualResult: '30$'},
    'Scale label 100 on Street Widget': {element: function ():void  {return element.all(by.css('text[class="scale-label"]')).last(); }, actualResult: '3000$'},
    'Zoom button +': {element: function () {return element.all(by.css('div[class="zoom-column pull-right"] b')).first(); }, actualResult: '+'},
    'Zoom button -': {element: function () {return element.all(by.css('div[class="zoom-column pull-right"] b')).last(); }, actualResult: '-'},
  },
  matrixPageBoolean:{
    'Home icon in header': {element: function ():void  {return $('.search-title-thing-icon.pull-left.icon'); }},
    'Glass icon in header': {element: function ():void  {return $('.matrix-search-button>img'); }},
    'Logo image in header': {element: function ():void  {return $('.icon-container.pull-left>a>img'); }},
    'Map image in header': {element: function ():void  {return $('.map.map_gray'); }},
    'Menu icon in header': {element: function ():void  {return $('.unactive'); }},
    'Street widget image': {element: function ():void  {return $('polygon[class="road"]'); }},
  },
  matrixPageImages:{
    'Rectangles on Street Widget': {element: function ():void  {return element.all(by.css('rect[class="point"]')); }},
    'Image content': {element: function ():void  {return element.all(by.css('.image-content.column-5')); }},
    'Country content': {element: function ():void  {return element.all(by.css('.place-image-box-country.pull-left')); }},
    'Income content': {element: function ():void  {return element.all(by.css('.place-image-box-income.pull-right')); }},
  },
  matrixPageSearchBoolean:{
    'Glass icon': {element: function ():void  {return $('.search-input>img'); }},
    'Close icon': {element: function ():void  {return $('.close'); }},
  },
  matrixPageSearchText:{
    'Things header in Search': {element: function ():void  {return element.all(by.css('.search-list-header>h3')).first(); }, actualResult: 'THINGS'},
    'Places header in Search': {element: function ():void  {return element.all(by.css('.search-list-header>h3')).last(); }, actualResult: 'PLACES'},
    'Things category -Home- in Search': {element: function ():void {return element.all(by.css('.category-name>span')).first(); }, actualResult: 'Home from outside'},
    'Things category -Agriculture- in Search': {element: function ():void {return element.all(by.css('.category-name>span')).get(1); }, actualResult: 'Agriculture'},
    'Things category -Countries- in Search': {element: function ():void {return element.all(by.css('.category-name>span')).last(); }, actualResult: 'Countries'},
    'Region category -Europe- in Search': {element: function ():void {return $('.search-item-name.europe'); }, actualResult: 'Europe'},
    'Region category -Africa- in Search': {element: function ():void  {return $('.search-item-name.africa'); }, actualResult: 'Africa'},
    'Region category -America- in Search': {element: function ():void {return $('.search-item-name.america'); }, actualResult: 'America'},
    'Region category -Asia- in Search': {element: function ():void {return $('.search-item-name.asia'); }, actualResult: 'Asia'},
  },
};
