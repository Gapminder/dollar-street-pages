'use strict';
import { $, by, element } from 'protractor';
import { ElementArrayFinder, ElementFinder } from 'protractor/built/index';

export class DataProvider {

  static countryPageText = {
    VisitedFamilies: { element: (): ElementFinder => $('p[class*="home"]') },
    TotalPhotos: { element: (): ElementFinder => $('p[class="photo"]') },
    VisitFamily: { element: (): ElementFinder => element.all(by.css('a[class*="custom-button"]')).first() }
  };

  static footerTextInfo = {
    getDollarStreet: { element: (): ElementFinder => $('.logo-container>p'), actualResult: 'DOLLAR STREET' },
    Home: { element: (): ElementFinder => element.all(by.css('.links>a')).get(0), actualResult: 'Home' },
    About: { element: (): ElementFinder => element.all(by.css('.links>a')).get(1), actualResult: 'About' },
    Team: { element: (): ElementFinder => element.all(by.css('.links>a')).get(2), actualResult: 'Team' },
    Donate: { element: (): ElementFinder => element.all(by.css('.links>a')).get(3), actualResult: 'Donate' },
    Photographers: {
      element: (): ElementFinder => element.all(by.css('.links>a')).get(4),
      actualResult: 'Photographers'
    }
  };

  static footerBooleanInfo = {
    FacebookIcon: { logoCSS: '.follow-button>a[href*="facebook"]' },
    TwitterIcon: { logoCSS: '.follow-button>a[href*="twitter"]' },
    InstagramIcon: { logoCSS: '.follow-button>a[href*="instagram"]' },
    LinkedinIcon: { logoCSS: '.follow-button>a[href*="linkedin"]' },
    Logo$: { logoCSS: 'img[alt="DollarStreet logo"]' },
    CreativeCommons: { logoCSS: 'img[alt="cc logo"]' },
    GapmingerLogo: { logoCSS: 'img[alt="Gapminder"]' }
  };

  static photographersPageField = {
    EnterAJSHARMAInSearchField: { photographerQuery: 'Sharm' },
    EnterJohanErikssonInSearchField: { photographerQuery: 'Eriks' },
    EnterLucForsythInSearchField: { photographerQuery: 'Luc' },
    EnterAmrSaidInSearchField: { photographerQuery: 'Amr' },
    EnterIvanGuilbertInSearchField: { photographerQuery: 'Iv' },
    EnterDavideVadalaInSearchField: { photographerQuery: 'Davide' }
  };

  static photographerPageBoolean = {
    NamePhotographer: { photographerDataCSS: '.heading' },
    PhotographerFamilies: { photographerDataCSS: '.family>h3' },
    TotalPhotosByPhotographer: { photographerDataCSS: '.photo' }
  };

  static mapPageCountry = {
    CountryBangladesh: {
      element: (): ElementFinder => element.all(by.css('span[class*="country-name"]')).get(0),
      actualResult: 'Bangladesh'
    },
    CountryColombia: {
      element: (): ElementFinder => element.all(by.css('span[class*="country-name"]')).get(8),
      actualResult: 'Colombia'
    },
    CountryIndonesia: {
      element: (): ElementFinder => element.all(by.css('span[class*="country-name"]')).get(13),
      actualResult: 'Indonesia'
    },
    CountryLithuania: {
      element: (): ElementFinder => element.all(by.css('span[class*="country-name"]')).get(17),
      actualResult: 'Liberia'
    },
    CountryRwanda: {
      element: (): ElementFinder => element.all(by.css('span[class*="country-name"]')).get(31),
      actualResult: 'Rwanda'
    }
  };

  static photographersPageSearch = {
    Input_Bangladesh_InSearchField: { countryQuery: 'bang' },
    Input_Bulgaria_InSearchField: { countryQuery: 'bulg' },
    Input_Colombia_InSearchField: { countryQuery: 'colomb' },
    Input_India_InSearchField: { countryQuery: 'indi' },
    Input_France_InSearchField: { countryQuery: 'fra' },
    Input_Kazakhstan_InSearchField: { countryQuery: 'kaza' },
    Input_Liberia_InSearchField: { countryQuery: 'libe' },
    Input_Mexico_InSearchField: { countryQuery: 'mexi' },
    Input_Turkey_InSearchField: { countryQuery: 'tur' }
  };

  static ambassadorsPageText = {
    H2InHeader: { element: (): ElementFinder => $('.heading.pull-left'), actualResult: 'Dollar Street Team' }
  };

  static ambassadorsPageBoolean = {
    LogoImgInHeader: { element: (): ElementFinder => $('.logo') },
    MenuIconInHeader: { element: (): ElementFinder => $('.menu-icon') }
  };

  static matrixPageText = {
    H2BYInHeader: {
      element: () =>
        element
          .all(by.css('div[class*="some-filter-container"]>span'))
          .first()
          .getText(),
      actualResult: 'in'
    },
    H2INInHeader: {
      element: () =>
        element
          .all(by.css('div[class*="some-filter-container"]>span'))
          .last()
          .getText(),
      actualResult: 'income'
    },
    PoorestHeaderOnStreetWidget: {
      element: () => $('text[class="poorest"]').getText(),
      actualResult: 'POOREST'
    },
    RichestHeaderOnStreetWidget: { element: () => $('text[class="richest"]').getText(), actualResult: 'RICHEST' }
  };

  static matrixPageBoolean = {
    HomeIconInHeader: { element: (): ElementFinder => $('.things-filter-button-content>img') },
    LogoImageInHeader: { element: (): ElementFinder => $('.logo') },
    MenuIconInHeader: { element: (): ElementFinder => $('.unactive') },
    StreetWidgetImage: { element: (): ElementFinder => $('polygon[class="road"]') },
    ThingsFilter: { element: (): ElementFinder => $('div[class*="things-filter-button-content"]') },
    CountryFilter: { element: (): ElementFinder => $('div[class*="countries-filter-button"]') }
  };

  static matrixPageImages = {
    HousesOnStreetWidget: { element: (): ElementArrayFinder => element.all(by.css('.chosen')) },
    ImageContent: { element: (): ElementArrayFinder => element.all(by.css('.image-content')) },
    CountryContent: { element: (): ElementArrayFinder => element.all(by.css('.place-image-box-country')) },
    IncomeContent: { element: (): ElementArrayFinder => element.all(by.css('.place-image-box-income')) }
  };

  static matrixPageSearchBoolean = {
    GlassIconInFilter: { element: (): ElementFinder => $('.things-search>img') },
    SearchField: { element: (): ElementFinder => $('input[type*="search"]') },
    FirstThingIconInFilter: { element: (): ElementFinder => element.all(by.css('.thing-icon')).first() },
    LastThingIconInFilter: { element: (): ElementFinder => element.all(by.css('.thing-icon')).last() },
    TwentythThingIconInFilter: { element: (): ElementFinder => element.all(by.css('.thing-icon')).get(19) }
  };

  static matrixPageSearchText = {
    HomesHeaderInSearch: {
      element: (): ElementFinder => element.all(by.css('div[class*="things-filter-button-content"] span')).first(),
      actualResult: 'Families'
    },
    AllIncomesHeaderInSearch: {
      element: (): ElementFinder => element.all(by.css('.income-title-container')).last(),
      actualResult: 'income'
    },
    TheWorldHeaderInSearch: {
      element: (): ElementFinder => element.all(by.css('div[class*="countries-filter-button"] span')).first(),
      actualResult: 'the World'
    }
  };

  static matrixPageQueries = {
    ThingPets: { query: 'Pets' },
    ThingFamilySnapshots: { query: 'Family snapshots' },
    ThingWalls: { query: 'Wall decorations' },
    ThingFrontDoor: { query: 'Front doors' },
    ThingSittingArea: { query: 'Sitting areas' },
    'ThingPlaces for dinner': { query: 'Places for dinner' },
    ThingArmchair: { query: 'Armchairs' },
    ThingBooks: { query: 'Books' }
  };

  static mapPageQueries = {
    ThingPets: { query: 'Armchairs' , count: 50 },
    ThingFamilySnapshots: { query: 'Family snapshots', count: 28 },
    ThingWalls: { query: 'Wall decorations', count: 49 },
    ThingFrontDoor: { query: 'Front doors', count: 50 },
    ThingSittingArea: { query: 'Sitting areas', count: 39 },
    ThingArmchair: { query: 'Cars', count: 27 },
    ThingBooks: { query: 'Books', count: 46 }
  };

  static countryPageId = {
    Bangladesh: { countryId: '55ef338d0d2b3c82037884d0', numberOfCell: '73' },
    Cambodia: { countryId: '55ef338d0d2b3c82037884d3', numberOfCell: '89' },
    France: { countryId: '55ef338d0d2b3c8203788441', numberOfCell: '123' },
    Indonesia: { countryId: '55ef338d0d2b3c82037884d9', numberOfCell: '144' },
    Latvia: { countryId: '55ef338d0d2b3c8203788448', numberOfCell: '163' },
    Mexico: { countryId: '55ef338d0d2b3c8203788479', numberOfCell: '181' },
    Nigeria: { countryId: '55ef338d0d2b3c82037884b7', numberOfCell: '196' },
    Philippines: { countryId: '55ef338d0d2b3c82037884ed', numberOfCell: '206' },
    Rwanda: { countryId: '55ef338d0d2b3c82037884b9', numberOfCell: '214' },
    Tunisia: { countryId: '55ef338d0d2b3c82037884c5', numberOfCell: '252' },
    Bolivia: { countryId: '55ef338d0d2b3c8203788469', numberOfCell: '80' },
    'Burkina Faso': { countryId: '55ef338d0d2b3c8203788493', numberOfCell: '87' },
    Burundi: { countryId: '55ef338d0d2b3c8203788494', numberOfCell: '88' },
    China: { countryId: '55ef338d0d2b3c82037884d4', numberOfCell: '97' },
    Colombia: { countryId: '55ef338d0d2b3c820378846c', numberOfCell: '98' },
    'Cote d`Ivoire': { countryId: '55ef338d0d2b3c820378849a', numberOfCell: '103' },
    Haiti: { countryId: '55ef338d0d2b3c8203788477', numberOfCell: '138' },
    India: { countryId: '55ef338d0d2b3c82037884d8', numberOfCell: '143' },
    Jordan: { countryId: '55ef338d0d2b3c82037884dd', numberOfCell: '154' },
    Kenya: { countryId: '55ef338d0d2b3c82037884a9', numberOfCell: '156' },
    Liberia: { countryId: '55ef338d0d2b3c82037884ab', numberOfCell: '166' },
    Malawi: { countryId: '55ef338d0d2b3c82037884b3', numberOfCell: '173' },
    Myanmar: { countryId: '55ef338d0d2b3c82037884e7', numberOfCell: '190' },
    Nepal: { countryId: '55ef338d0d2b3c82037884e8', numberOfCell: '192' },
    Pakistan: { countryId: '55ef338d0d2b3c82037884eb', numberOfCell: '199' },
    'Papua New Guinea': { countryId: '55ef338d0d2b3c82037884e2', numberOfCell: '203' },
    Romania: { countryId: '55ef338d0d2b3c8203788455', numberOfCell: '212' },
    Russia: { countryId: '55ef338d0d2b3c82037884ef', numberOfCell: '213' },
    Somalia: { countryId: '55ef338d0d2b3c82037884bf', numberOfCell: '231' },
    'South Africa': { countryId: '55ef338d0d2b3c82037884c9', numberOfCell: '232' },
    'South Korea': { countryId: '55ef338d0d2b3c82037884f3', numberOfCell: '159' },
    Sweden: { countryId: '55ef338d0d2b3c820378845b', numberOfCell: '241' },
    Tanzania: { countryId: '55ef338d0d2b3c82037884c6', numberOfCell: '246' },
    Thailand: { countryId: '55ef338d0d2b3c82037884f7', numberOfCell: '247' },
    Turkey: { countryId: '55ef338d0d2b3c82037884f8', numberOfCell: '253' },
    Ukraine: { countryId: '55ef338d0d2b3c820378845d', numberOfCell: '258' },
    'United Kingdom': { countryId: '55ef338d0d2b3c820378845e', numberOfCell: '260' },
    'United States': { countryId: '55ef338d0d2b3c8203788467', numberOfCell: '261' },
    Vietnam: { countryId: '55ef338d0d2b3c82037884fc', numberOfCell: '266' },
    Zimbabwe: { countryId: '55ef338d0d2b3c82037884cb', numberOfCell: '271' }
  };

  static homePageBoolean = {
    LogoImgInHeader: { element: (): ElementFinder => element.all(by.css('.logo')).first() },
    LinkToFilter: { element: (): ElementFinder => element.all(by.css('.heading.pull-left')).first() },
    FamilyImage: { element: (): ElementFinder => element.all(by.css('.image-container>img')).first() },
    MapImage: { element: (): ElementFinder => $('.map.map_gray') },
    FamilyName: { element: (): ElementFinder => element.all(by.css('.title')).first() },
    FamilyIncome: { element: (): ElementFinder => element.all(by.css('.title')).get(1) },
    CountryName: { element: (): ElementFinder => element.all(by.css('.title')).get(2) }
  };

  static homePageText = {
    TextFilterInHeaderHome: {
      element: (): ElementFinder => $('p[class*="heading pull-left"]'),
      actualResult: 'Families in the World'
    },
    TextHomeOf: { element: (): ElementFinder => element.all(by.css('.sub-title')).first(), actualResult: 'Home of' },
    TextHouseholdWeeklyIncome: {
      element: (): ElementFinder => element.all(by.css('.sub-title')).get(1),
      actualResult: 'Monthly income'
    },
    TextCountry: { element: (): ElementFinder => element.all(by.css('.sub-title')).get(2), actualResult: 'Country' },
    ShowArticle: { element: (): ElementFinder => $('div[class*="show-info"] span'), actualResult: 'Read more' }
  };

  static welcomeWizardText = {
    findOutHowPeopleLive: {
      element: (): ElementFinder => $('.quick-guide-description-container>h1'),
      actualResult: 'DOLLAR STREET'
    },
    welcomeHeaderDescription: {
      element: (): ElementFinder => $('div[class^="guide-description"]'),
      actualResult:
        'In the news people in other cultures seem stranger than they are.' +
        '\n' +
        'We visited 264 families in 50 countries and collected 30,000 photos.' +
        '\n' +
        'We sorted the homes by income, from left to right.'
    },
    quickTour: { element: (): ElementFinder => $('.bg-orange'), actualResult: 'Quick tour' },
    maybeLater: {
      element: (): ElementFinder => element.all(by.css('.button-container>button')).get(1),
      actualResult: 'Maybe later'
    },
    seeHowPeopleLive: {
      element: (): ElementFinder => $('.quick-guide-description-container>h2'),
      actualResult: 'See how people really live'
    },
    closeButton: { element: (): ElementFinder => $('.quick-guide-container>img'), actualResult: '' },
    logo: { element: (): ElementFinder => $('div[class*="logo-container"] img[alt="Logo"]'), actualResult: '' }
  };

  static photographerLinks = {
    JohanEriksson: {
      photographerLink: '/dollar-street/photographer/56ec0916af72e9437cbccf91'
    },
    JonathanTaylor: {
      photographerLink: '/dollar-street/photographer/56ec0917af72e9437cbccf94'
    },
    LucForsyth: {
      photographerLink: '/dollar-street/photographer/56ec0918af72e9437cbccf97'
    },
    RolandZsigmond: {
      photographerLink: '/dollar-street/photographer/56ec0917af72e9437cbccf95'
    },
    'Victrixia Montes': {
      photographerLink: '/dollar-street/photographer/56ec0916af72e9437cbccf90'
    }
  };

  static stickyFooterIcons = {
    Twitter: { element: (): ElementFinder => $('div[class*="float-footer"] div[class*="twitter"]') },
    Facebook: { element: (): ElementFinder => $('div[class*="float-footer"] div[class*="facebook"]') },
    Linkedin: { element: (): ElementFinder => $('div[class*="float-footer"] div[class*="linkedin"]') },
    Google: { element: (): ElementFinder => $('div[class*="float-footer"] div[class*="google"]') },
    TwitterFollow: { element: (): ElementFinder => $('iframe[id*="twitter-widget-0"]') },
    FacebookFollow: { element: (): ElementFinder => element.all(by.css('div[class*="fb-like"]')).first() },
    AngleUp: { element: (): ElementFinder => element.all(by.css('.back-to-top')).first() }
  };

  static homePageLinks = {
    Burundi27: {
      element: '54afe95c80d862d9767cf32e',
      actualFamilyName: 'Butoyi',
      actualCountry: 'Burundi',
      actualIncome: '27'
    },
    Romania163: {
      element: '56446ce95ace839829fe897f',
      actualFamilyName: 'Mezei',
      actualCountry: 'Romania',
      actualIncome: '163'
    },
    India466: {
      element: '54b520ed05df73e55431912b',
      actualFamilyName: 'Gada',
      actualCountry: 'India',
      actualIncome: '466'
    }
  };

  static mapPageHover = {
    'Family Image': { element: (): ElementFinder => $('.hover_portrait_box>img') },
    'Family Name': { element: (): ElementFinder => element.all(by.css('.name')).first() },
    'Country Name': { element: (): ElementFinder => element.all(by.css('.country')).first() },
    'Family Income': { element: (): ElementFinder => element.all(by.css('.income')).first() }
  };

  static socialNetworksAccounts = {
    Twitter: { userEmail: 'testvalorsoftware@gmail.com', password: 'testvalor' },
    Facebook: { userEmail: 'testvalorsoftware@gmail.com', password: 'testvalor' },
    LinkedIn: { userEmail: 'testvalorsoftware@gmail.com', password: 'testvalor' }
  };

  static aboutPageLinksURLs = {
    gapminderHere: { selector: 'a[href=\'https://www.gapminder.org/about-gapminder/\']'},
    ccLicence: { selector: 'a[href=\'https://creativecommons.org/licenses/by/4.0/\']'},
    termsOfUse: { selector: 'a[href=\'https://docs.google.com/document/pub?id=1POd-pBMc5vDXAmxrpGjPLaCSDSWuxX6FLQgq5DhlUhM\']'},
    PrivacyPolicy: { selector: 'a[href=\'https://docs.google.com/document/d/1mjAd9CI42lqqENX2RRa0jQgtK4-ogqhhjCYrq9mjDfg/edit\']'},
    signUpHere: { selector: 'a[href=\'https://docs.google.com/a/gapminder.org/forms/d/e/1FAIpQLSdvIkRRpk0ikGYiimjtCTbCngLvIQeB6jz6KoTp2C_lciYzpw/viewform\']'},
    hereAreTheResources: { selector: 'a[href=\'https://drive.google.com/drive/folders/0By2siUCQWXnSallDVzdwel9Rd00\']'},
    qAndA: { selector: 'a[href=\'https://docs.google.com/document/d/13u87BWz450cqvqr4TaiWi84yiNa5MOItr46_g1xRcTY/edit?usp=sharing\']' },
    pressKit: { selector: 'a[href=\'https://drive.google.com/drive/folders/0B0HB08a-a9MbVGJDX0hPSHhETnc\']' },
    ideasAward: { selector: 'a[href=\'https://www.fastcompany.com/3068873/announcing-the-winners-of-the-2017-world-changing-ideas-awards\']' },
    brewhouseAward: { selector: 'a[href=\'http://brewhouse.se/the-brewhouse-award/#the-brewhouse-award-2015\']' },
    detailedIncomeCalculations: { selector: 'a[href=\'https://drive.google.com/drive/folders/0B9jWD65HiLUnRm5ZNWlMSU5GNEU?usp=sharing\']' },
    annasEmail: { selector: 'a[href=\'mailto:anna@gapminder.org\']' },
    fernandasEmail: { selector: 'a[href=\'mailto:fernanda@gapminder.org\']' }
  };
}
