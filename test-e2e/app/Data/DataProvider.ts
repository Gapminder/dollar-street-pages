'use strict';
module.exports = {
  footerTextInfo:{
    'Dollar Street': {element: () => {return $('p[class="logo_name"]');}, actualResult: 'Dollar Street'},
    'About': {element: () => {return element.all(by.css('a[ng-reflect-route-params="Info"]')).last();}, actualResult: 'About'},
    'Our Photographers': {element: () => {return element.all(by.css('a[ng-reflect-route-params="Photographers"]')).last(); }, actualResult: 'Our Photographers'},
    'How to reuse photos': {element: () => {return $('a[ng-reflect-route-params="Home"]'); }, actualResult: 'How to reuse photos'},
  },
  footerBooleanInfo:{
    'FacebookIcon': {   logoCSS: 'div[class="footer"] div[class*="facebook"]'},
    'TwitterIcon': {    logoCSS: 'div[class="footer"] div[class*="twitter"]'},
    'GoogleIcon': {     logoCSS: 'div[class="footer"] div[class*="google"]'},
    'LinkedinIcon': {   logoCSS: 'div[class="footer"] div[class*="linkedin"]'},
    'Logo $': { logoCSS: 'img[alt="dollarstreet logo"]'},
    'Creative Commons': { logoCSS: 'img[alt="cc logo"]'},
    'Gapminger logo': { logoCSS: '.f-gap>img'}
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
    'Linkedin icon': {element: 'div[class*="header"] .fa.fa-linkedin'}
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
    'Enter Alisia Sidorenko in Search field': {photographerQuery: 'Alis'}
  },
  photographerPageBoolean: {
    'Name Photographer': {photographerDataCSS: '.heading'},
    'Photographer families': {photographerDataCSS: '.family>h3'},
    'Total photos by Photographer': {photographerDataCSS: '.photo'}
  },
  mapPageCountry:{
    'Country Bangladesh': {element: () => {return $('span[href$="55ef338d0d2b3c82037884d0"]'); }, actualResult: 'Bangladesh'},
    'Country Colombia': {element: () => {return $('span[href$="55ef338d0d2b3c820378846c"]'); }, actualResult: 'Colombia'},
    'Country Indonesia': {element: () => {return $('span[href$="55ef338d0d2b3c82037884d9"]'); }, actualResult: 'Indonesia'},
    'Country Lithuania': {element: () => {return $('span[href$="55ef338d0d2b3c820378844a"]'); }, actualResult: 'Lithuania'},
    'Country Rwanda': {element: () => {return $('span[href$="55ef338d0d2b3c82037884b9"]'); }, actualResult: 'Rwanda'}
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
    'Input Turkey in Search field': {countryQuery: 'tur'}
  },
  ambassadorsPageText:{
    'H2 in header': {element: () => {return $('h2[class*="heading"]'); }, actualResult: 'Ambassadors'}
  },
  ambassadorsPageBoolean:{
    'Logo img in header': {element: () => {return $('.logo.pull-left>img'); }},
    'Menu icon in header': {element: () => {return $('.menu-icon'); }},
    'Matrix icon in header': {element: () => { return $('img[src*="dark-matrix-icon"]'); }}
  },
  matrixPageText:{
    'H2 -by- in header': {element: () => {return element.all(by.css('.some-filter-container>span')).first(); }, actualResult: 'by'},
    'H2 -in- in header': {element: () => {return element.all(by.css('.some-filter-container>span')).last(); }, actualResult: 'in'},
    'Poorest header on Street Widget': {element: () => {return $('text[class="poorest"]'); }, actualResult: 'Poorest'},
    'Richest header on Street Widget': {element: () => {return $('text[class="richest"]'); }, actualResult: 'Richest'},
    //'Scale label 30 on Street Widget': {element: () => {return element.all(by.css('text[class="scale-label"]')).first(); }, actualResult: '30$'},
    //'Scale label 300 on Street Widget': {element: () => {return element.all(by.css('text[class="scale-label"]')).get(1); }, actualResult: '300$'},
    //'Scale label 3000 on Street Widget': {element: () => {return element.all(by.css('text[class="scale-label"]')).last(); }, actualResult: '3000$'},
    'Zoom button +': {element: () => {return element.all(by.css('div[class="zoom-column pull-right"] b')).first(); }, actualResult: '+'},
    'Zoom button -': {element: () => {return element.all(by.css('div[class="zoom-column pull-right"] b')).last(); }, actualResult: '-'}
  },
  matrixPageBoolean:{
    'Home icon in header': {element: () => {return $('.things-filter-button-content>img'); }},
    'Logo image in header': {element: () => {return $('.icon-container.pull-left>a>img'); }},
    'Menu icon in header': {element: () => {return $('.unactive'); }},
    'Street widget image': {element: () => {return $('polygon[class="road"]'); }},
    'Things filter': {element: () => {return $('div[class*="things-filter-button-content"]'); }},
    'Incomes filter': {element: () => {return $('div[class*="incomes-filter-button"]'); }},
    'Country filter': {element: () => {return $('div[class*="countries-filter-button"]'); }}
  },
  matrixPageImages:{
    'Houses on Street Widget': {element: () => {return element.all(by.css('polygon[class="point"]')); }},
    'Image content': {element: () => {return element.all(by.css('.image-content.column-4')); }},
    'Country content': {element: () => {return element.all(by.css('.place-image-box-country.pull-left')); }},
    'Income content': {element: () => {return element.all(by.css('.place-image-box-income.pull-right')); }}
  },
  matrixPageSearchBoolean:{
    'Glass icon in filter': {element: () => {return $('.things-search>img'); }},
    'Search field': {element: () => {return $('input[type*="search"]'); }},
    'First thing icon in filter': {element: () => {return element.all(by.css('.thing-icon')).first(); }},
    'Last thing icon in filter': {element: () => {return element.all(by.css('.thing-icon')).last(); }},
    '20th thing icon in filter': {element: () => {return element.all(by.css('.thing-icon')).get(19); }}
  },
  matrixPageSearchText:{
    'Homes header in Search': {element: () => {return element.all(by.css('div[class*="things-filter-button-content"] span')).first(); }, actualResult: 'Homes'},
    '-all incomes- header in Search': {element: () => {return element.all(by.css('div[class*="incomes-filter-button"] span')).first(); }, actualResult: 'all incomes'},
    '-the world- header in Search': {element: () => {return element.all(by.css('div[class*="countries-filter-button"] span')).first(); }, actualResult: 'the world'}
  },
  matrixPageQueries:{
    'Thing Kitchen': {query: 'Kitchen'},
    'Thing Bathroom': {query: 'Bathroom'},
    'Thing Cleaning floors': {query: 'Cleaning floors'},
    'Thing Roof': {query: 'Roof'},
    'Thing Front door': {query: 'Front door'},
    'Thing Sitting area': {query: 'Sitting area'},
    'Thing Ceiling': {query: 'Ceiling'},
    'Thing Sofa': {query: 'Sofa'},
    'Thing Armchair': {query: 'Armchair'},
    //'Thing Wardrobe': {query: 'Wardrobe'},
    // 'Thing Armchair': {query: 'Armchair'},
    'Thing Books': {query: 'Books'},
    'Thing Newspaper': {query: 'Newspaper'}
    /* 'Thing Newspaper': {query: 'Newspaper'},
     'Thing Pen': {query: 'Pen'},
     'Thing Owen': {query: 'Owen'},
     'Thing Salt': {query: 'Salt'},
     'Thing Stove': {query: 'Stove'},
     'Thing Radio': {query: 'Radio'},*/
  },
  countryPageId:{
    'Bangladesh': {countryId: '55ef338d0d2b3c82037884d0'},
    'Cambodia': {countryId: '55ef338d0d2b3c82037884d3'},
    'France': {countryId: '55ef338d0d2b3c8203788441'},
    'Indonesia': {countryId: '55ef338d0d2b3c82037884d9'},
    'Latvia': {countryId: '55ef338d0d2b3c8203788448'},
    'Mexico': {countryId: '55ef338d0d2b3c8203788479'},
    'Nigeria': {countryId: '55ef338d0d2b3c82037884b7'},
    'Philippines': {countryId: '55ef338d0d2b3c82037884ed'},
    'Rwanda': {countryId: '55ef338d0d2b3c82037884b9'},
    'Tunisia': {countryId: '55ef338d0d2b3c82037884c5'}
  },
  countryPageText:{
    'Visited Families': {element: () => { return $('div[class*="header"] p[class="home"]'); }},
    'Total Photos': {element: () => { return $('p[class="photo"]'); }},
    'Visit family': {element: () => { return element.all(by.css('a[class*="custom-button"]')).first();}}
  },
  /* placePageText:{
   'Poorest header on Street Widget': {element: () => { return $('text[class="poorest"]'); }, actualResult: 'Poorest'},
   'Richest header on Street Widget': {element: () => { return $('text[class="richest"]'); }, actualResult: 'Richest'},
   'Scale label 30 on Street Widget': {element: () => { return element.all(by.css('text[class="scale-label"]')).first(); }, actualResult: '30$'},
   'Scale label 300 on Street Widget': {element: () => { return element.all(by.css('text[class="scale-label"]')).get(1); }, actualResult: '300$'},
   'Scale label 3000 on Street Widget': {element: () => { return element.all(by.css('text[class="scale-label"]')).last(); }, actualResult: '3000$'},
   'Link -All Family portraits- near info about family': {element: () => { return element.all(by.css('.slide-button.pull-left>span')).get(1); }, actualResult: '<< All Family portraits'},
   'Link -Read More- near info about Family': {element: () => { return element.all(by.css('div[class*="slide-descript"]  span[class*="span-link"]')).get(1); }, actualResult: 'Read more >>'},
   'Thing name on the big image': {element: () => { return element.all(by.css('div[class*="image"]>div[class*="thing-content"]>span')).get(1); }, actualResult: 'Family portrait'}
   },
   placePageBoolean:{
   'Little family image in header': {element: () => { return $('.icon.pull-left'); }},
   'Menu icon in header': {element: () => { return $('.unactive'); }},
   'Matrix icon in header': {element: () => { return $('div[class*="matrix-icon"] img'); }},
   'Street widget image': {element: () => { return $('polygon[class="road"]'); }},
   'First Divider on Street Widget': {element: () => { return element.all(by.css('image[class*="scale-label"]')).first(); }},
   'Second Divider on Street Widget': {element: () => { return element.all(by.css('image[class*="scale-label"]')).get(1); }},
   'Last Divider on Street Widget': {element: () => { return element.all(by.css('image[class*="scale-label"]')).last(); }},
   'Home with region colour on the Street Widget': {element: () => {return $('polygon[class*="hover"]'); }},
   'Big family image': {element: () => { return element.all(by.css('.slide-img')).get(1); }},
   'First little family image': {element: () => { return element.all(by.css('.slide-sidebar>img')).get(2); }},
   'Second little family image': {element: () => { return element.all(by.css('.slide-sidebar>img')).get(3); }},
   'Text about family in header': {element: () => { return $('p[class="pull-left"]');},},
   'Thing icon on the big family image': {element: () => { return element.all(by.css('div[class*="thingNameOnFilter-content"] img')); }},
   'Map icon under the big family image': {element: () => { return element.all(by.css('img[class*="map_gray"]'));}},
   'Marker on the map under the big family image': {element: () => { return element.all(by.css('img[class*="marker"]'));}},
   //'Info button near the family income': {element: () => { return $('#about-info');}},
   'Photographer name near the footer': {element: () => { return $('p[class*="photographer"]');}}
   },*/
  blogPageText:{
    'H2 -Blog-': {element: () => { return $('h2[class*="heading"]');}, actualResult: 'Blog'},
    'Read More near the first post': {element: () => { return element.all(by.css('div[class*="article-description"] a')).first();}, actualResult: 'Read more >>'},
    'Read More near the last post': {element: () => { return element.all(by.css('div[class*="article-description"] a')).last();}, actualResult: 'Read more >>'},
    'Read More near the 5th post': {element: () => { return element.all(by.css('div[class*="article-description"] a')).get(4);}, actualResult: 'Read more >>'}
  },
  blogPagePosts:{
    'h1': {element: () => { return $('.title');}},
    'Date': {element: () => { return $('.date-info.margin-top-0');}}
  },
  matrixBigSection: {
    'Family name': {element: () => { return $('.home-description-container>h3');}},
    'Family description': {element: () => { return $('.text-justify');}},
    'Block with photos: family': {element: () => { return element.all(by.css('.images-container')).first();}},
    'Block with photos: home': {element: () => { return element.all(by.css('.images-container')).last();}}
  },
  matrixBigSectionHower: {
    'CC icon': {element: () => { return $('.icon-bottom-image.cc-link');}},
    'Icon (+)': {element: () => { return element.all(by.css('.fa.fa-search-plus')).first();}},
    'Icon Download': {element: () => { return element.all(by.css('.fa.fa-download')).last();}},
    'Link to Photographer Page': {element: () => { return element.all(by.css('a[class*="color-grey"]')).first();}},
    'Link to CC': {element: () => { return element.all(by.css('a[class*="color-grey"]')).get(1);}},
    'Link to View Full size': {element: () => { return element.all(by.css('a[class*="color-grey"]')).get(2);}},
    'Link to Download image': {element: () => { return element.all(by.css('a[class*="color-grey"]')).last();}}
  },
  homePageBoolean: {
    'Logo img in header': {element: () => { return element.all(by.css('.logo.pull-left>img')).first();}},
    'Link to filter': {element: () => { return element.all(by.css('.heading.pull-left')).first();}},
    'Family image': {element: () => { return $('.image-container>img');}},
    'Map image': {element: () => { return $('.map.map_gray');}},
    'Family name': {element: () => { return element.all(by.css('.title')).first();}},
    'Family income': {element: () => { return element.all(by.css('.title')).get(1);}},
    'Country name': {element: () => { return element.all(by.css('.title')).last();}},
    'Photos by photographer link': {element: () => { return $('.go-to-photographer-page>p');}},
    'Back to matrix with same filter - on the footer': {element: () => { return $('.go-to-back>span');}}
  },
  homePageText: {
    'Text filter in header -Home-': {element: () => { return element.all(by.css('.heading.pull-left>span')).first();}, actualResult: 'Home'},
    'Text filter in header -all incomes-': {element: () => { return element.all(by.css('.heading.pull-left>span')).get(1);}, actualResult: 'all incomes'},
    'Text filter in header -the world-': {element: () => { return element.all(by.css('.heading.pull-left>span')).get(2);}, actualResult: 'the world'},
    'Text -Home of the-': {element: () => { return element.all(by.css('.sub-title')).first();}, actualResult: 'Home of the'},
    'Text -Household weekly income-': {element: () => { return element.all(by.css('.sub-title')).get(1);}, actualResult: 'Household monthly income'},
    'Text -Country-': {element: () => { return element.all(by.css('.sub-title')).last();}, actualResult: 'Country'},
    'Show article': {element: () => { return $('.show-info>span');}, actualResult: 'Show article'}
  }
};
