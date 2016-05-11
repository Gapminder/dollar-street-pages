'use strict';
module.exports = {
    sitemapInfo:{
        'Main': {           namePage: 'Main',          element: '#sitemap>li>a[href*="main"]',          elementCSS: 'div[class*="menu pull-left"]>a[href*="matrix"]'},
        'Matrix': {         namePage: 'Matrix',        element: '#sitemap>li>a[href*="matrix"]',        elementCSS: '.search-title-thing-icon.pull-left.icon'},
        'Photographers': {  namePage: 'Photographers', element: '#sitemap>li>a[href*="photographers"]', elementCSS: '.heading'},
        'Photographer': {   namePage: 'Photographer',  element: '#sitemap>li>a[href*="photographer?"]', elementCSS: '.heading'},
        'Place': {          namePage: 'Place',         element: '#sitemap>li>a[href*="place"]',         elementCSS: '.photographer'},
        'Map': {            namePage: 'Map',           element: '#sitemap>li>a[href^="/map"]',          elementCSS: '.mapBoxContainer>img.map-color'},
        'Ambassadors': {    namePage: 'Ambassadors',   element: '#sitemap>li>a[href*="ambass"]',        elementCSS: '.ambassadors-peoples>h2'},
        'Country': {        namePage: 'Country',       element: '#sitemap>li>a[href*="country"]',       elementCSS: '.heading'},
    },
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
        'Link Homes': {element: 'div[class*="menu"]>a[href*="matrix"]', actualResult: 'Homes'},
        'Link Map': {element: 'div[class*="menu"]>a[href^="/map"]', actualResult: 'Map'},
        'Link Photographers': {element: 'div[class*="menu"]>a[href*="photographers"]', actualResult: 'Photographers'},
        'Link Ambassadors': {element: 'div[class*="menu"]>a[href*="ambassadors"]', actualResult: 'Ambassadors'}
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
        'Enter Zoriah Miller in Search field': {photographerQuery: 'Mille'},
    },
    photographerPageBoolean: {
        'Name Photographer': {photographerDataCSS: '.header>h2'},
        'Photographer families': {photographerDataCSS: '.family>h3'},
        'Total photos by Photographer': {photographerDataCSS: '.photo'}
    },
    mapPageCountry:{
        'Country Bangladesh': {element: function () {return $('span[href$="55ef338d0d2b3c82037884d0"]');}, actualResult: 'Bangladesh'},
        'Country Colombia': {element: function () {return $('span[href$="55ef338d0d2b3c820378846c"]');}, actualResult: 'Colombia'},
        'Country Indonesia': {element: function () {return $('span[href$="55ef338d0d2b3c82037884d9"]');}, actualResult: 'Indonesia'},
        'Country Lithuania': {element: function () {return $('span[href$="55ef338d0d2b3c820378844a"]');}, actualResult: 'Lithuania'},
        'Country Rwanda': {element: function () {return $('span[href$="55ef338d0d2b3c82037884b9"]');}, actualResult: 'Rwanda'},
        'Sub-title -Home on the World Map-': {element: function () {return $('div[class*="search-text"]>span');}, actualResult: 'Home on the World map'},
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
        'H2 in header': {element: function () {return $('h2[class="heading"]');}, actualResult: 'Ambassadors'},
        'Sub-header Teachers': {element: function () {return element.all(by.css('div[class="ambassadors-peoples"] > h2')).first();}, actualResult: 'Teachers'},
        'Sub-header Writers': {element: function () {return element.all(by.css('div[class="ambassadors-peoples"] > h2')).get(1);}, actualResult: 'Writers'},
        'Sub-header Organisations': {element: function () {return element.all(by.css('div[class="ambassadors-peoples"] > h2')).last();}, actualResult: 'Organisations'},
    },
    ambassadorsPageBoolean:{
        'Logo img in header': {element: function () {return $('.logo.pull-left>img');}},
        'Menu icon in header': {element: function () {return $('.menu-icon');}}
}
}

