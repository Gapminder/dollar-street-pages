'use strict';
import { element, by, $ } from 'protractor/globals';
import { ElementFinder, ElementArrayFinder } from 'protractor/built/index';

export class DataProvider {
  public static blogPagePosts:any = {
    'h1': {element: ():ElementFinder => $('.title')},
    'Date': {element: ():ElementFinder => $('.date-info.margin-top-0')}
  };
  public static countryPageText:any = {
    'VisitedFamilies': {element: ():ElementFinder => $('div[class*="header"] p[class="home"]')},
    'TotalPhotos': {element: ():ElementFinder => $('p[class="photo"]')},
    'VisitFamily': {element: ():ElementFinder => element.all(by.css('a[class*="custom-button"]')).first()}
  };
  public static footerTextInfo:any = {
    'getDollarStreet': {element: ():ElementFinder => $('.logo-container>p'), actualResult: 'Dollar Street'},
    'About': {element: ():ElementFinder => element.all(by.css('.links>a')).get(0), actualResult: 'About'},
    'OurPhotographers': {element: ():ElementFinder => element.all(by.css('.links>a')).get(1), actualResult: 'Our Photographers'},
    'HowToReusePhotos': {element: ():ElementFinder => element.all(by.css('.links>a')).last(), actualResult: 'How to reuse photos'}
  };
  public static footerBooleanInfo:any = {
    'FacebookIcon': {logoCSS: 'div[class="footer"] div[class*="facebook"]'},
    'TwitterIcon': {logoCSS: 'div[class="footer"] div[class*="twitter"]'},
    'GoogleIcon': {logoCSS: 'div[class="footer"] div[class*="google"]'},
    'LinkedinIcon': {logoCSS: 'div[class="footer"] div[class*="linkedin"]'},
    'Logo$': {logoCSS: 'img[alt="DollarStreet logo"]'},
    'CreativeCommons': {logoCSS: 'img[alt="cc logo"]'},
    'GapmingerLogo': {logoCSS: 'img[alt="Gapminder"]'}
  };
  public static photographersPageField:any = {
   'EnterAJSHARMAInSearchField': {photographerQuery: 'Sharm'},
   'EnterJohanErikssonInSearchField': {photographerQuery: 'Eriks'},
   'EnterLucForsythInSearchField': {photographerQuery: 'Luc'},
   'EnterAmrSaidInSearchField': {photographerQuery: 'Amr'},
   'EnterIvanGuilbertInSearchField': {photographerQuery: 'Iv'},
   'EnterAlisiaSidorenkoInSearchField': {photographerQuery: 'Alis'}
   };
  public static photographerPageBoolean:any = {
   'NamePhotographer': {photographerDataCSS: '.heading'},
   'PhotographerFamilies': {photographerDataCSS: '.family>h3'},
   'TotalPhotosByPhotographer': {photographerDataCSS: '.photo'}
   };
  public static mapPageCountry:any = {
   'CountryBangladesh': {element: ():ElementFinder => $('span[ng-reflect-router-link$="55ef338d0d2b3c82037884d0"]'), actualResult: 'Bangladesh'},
   'CountryColombia': {element: ():ElementFinder => $('span[ng-reflect-router-link$="55ef338d0d2b3c820378846c"]'), actualResult: 'Colombia'},
   'CountryIndonesia': {element: ():ElementFinder => $('span[ng-reflect-router-link$="55ef338d0d2b3c82037884d9"]'), actualResult: 'Indonesia'},
   'CountryLithuania': {element: ():ElementFinder => $('span[ng-reflect-router-link$="55ef338d0d2b3c820378844a"]'), actualResult: 'Lithuania'},
   'CountryRwanda': {element: ():ElementFinder => $('span[ng-reflect-router-link$="55ef338d0d2b3c82037884b9"]'), actualResult: 'Rwanda'}
   };
  public static photographersPageSearch:any = {
   'InputBangladeshInSearchField': {countryQuery: 'bang'},
   'InputBulgariaInSearchField': {countryQuery: 'bulg'},
   'InputColombiaInSearchField': {countryQuery: 'colomb'},
   'InputIndiaInSearchField': {countryQuery: 'indi'},
   'InputFranceInSearchField': {countryQuery: 'fra'},
   'InputKazakhstanInSearchField': {countryQuery: 'kaza'},
   'InputLiberiaInSearchField': {countryQuery: 'libe'},
   'InputMexicoInSearchField': {countryQuery: 'mexi'},
   'InputTurkeyInSearchField': {countryQuery: 'tur'}
   };
  public static ambassadorsPageText:any = {
   'H2InHeader': {element: ():ElementFinder => $('h2[class*="heading"]'), actualResult: 'Ambassadors'}
   };
  public static ambassadorsPageBoolean:any = {
   'LogoImgInHeader': {element: ():ElementFinder => $('.logo.pull-left>img')},
   'MenuIconInHeader': {element: ():ElementFinder => $('.menu-icon')}
   };
  public static matrixPageText:any = {
   'H2BYInHeader': {element: ():string => element.all(by.css('div[class*="some-filter-container"]>span')).first().getText(), actualResult: 'in'},
   'H2INInHeader': {element: ():string => element.all(by.css('div[class*="some-filter-container"]>span')).last().getText(), actualResult: 'by'},
   'PoorestHeaderOnStreetWidget': {element: ():string => $('text[class="poorest"]').getText(), actualResult: 'Poorest'},
   'RichestHeaderOnStreetWidget': {element: ():string => $('text[class="richest"]').getText(), actualResult: 'Richest'}
   };
  public static matrixPageBoolean:any = {
   'HomeIconInHeader': {element: ():ElementFinder => $('.things-filter-button-content>img')},
   'LogoImageInHeader': {element: ():ElementFinder => $('.icon-container.pull-left>a>img')},
   'MenuIconInHeader': {element: ():ElementFinder => $('.unactive')},
   'StreetWidgetImage': {element: ():ElementFinder => $('polygon[class="road"]')},
   'ThingsFilter': {element: ():ElementFinder => $('div[class*="things-filter-button-content"]')},
   'IncomesFilter': {element: ():ElementFinder => $('div[class*="incomes-filter-button"]')},
   'CountryFilter': {element: ():ElementFinder => $('div[class*="countries-filter-button"]')},
   'ZoomButtonPlus': {element: ():ElementFinder => $('button[class*="increase"]'), actualResult: '+'},
   'ZoomButtonMinus': {element: ():ElementFinder => $('button[class*="decrease"]'), actualResult: '-'}
   };
  public static matrixPageImages:any = {
   'HousesOnStreetWidget': {element: ():ElementArrayFinder => element.all(by.css('polygon[class="point"]'))},
   'ImageContent': {element: ():ElementArrayFinder => element.all(by.css('.image-content.column-4'))},
   'CountryContent': {element: ():ElementArrayFinder => element.all(by.css('.place-image-box-country'))},
   'IncomeContent': {element: ():ElementArrayFinder => element.all(by.css('.place-image-box-income'))}
   };
  public static matrixPageSearchBoolean:any = {
   'GlassIconInFilter': {element: ():ElementFinder => $('.things-search>img')},
   'SearchField': {element: ():ElementFinder => $('input[type*="search"]')},
   'FirstThingIconInFilter': {element: ():ElementFinder => element.all(by.css('.thing-icon')).first()},
   'LastThingIconInFilter': {element: ():ElementFinder => element.all(by.css('.thing-icon')).last()},
   'TwentythThingIconInFilter': {element: ():ElementFinder => element.all(by.css('.thing-icon')).get(19)}
   };
  public static matrixPageSearchText:any = {
   'HomesHeaderInSearch': {element: ():ElementFinder => element.all(by.css('div[class*="things-filter-button-content"] span')).first(), actualResult: 'Homes'},
   'AllIncomesHeaderInSearch': {element: ():ElementFinder => element.all(by.css('div[class*="incomes-filter-button"] span')).first(), actualResult: 'all incomes'},
   'TheWorldHeaderInSearch': {element: ():ElementFinder => element.all(by.css('div[class*="countries-filter-button"] span')).first(), actualResult: 'the world'}
   };
  public static matrixPageQueries:any = {
   'ThingKitchen': {query: 'Kitchen'},
   'ThingBathroom': {query: 'Bathroom door'},
   'ThingCleaningFloors': {query: 'Cleaning floors'},
   'ThingRoof': {query: 'Roof'},
   'ThingFrontDoor': {query: 'Front door'},
   'ThingSittingArea': {query: 'Sitting area'},
   'ThingCeiling': {query: 'Ceiling'},
   'ThingSofa': {query: 'Sofa'},
   'ThingArmchair': {query: 'Armchair'},
   'ThingBooks': {query: 'Books'},
   'ThingNewspaper': {query: 'Newspaper'}
   };
  public static countryPageId:any = {
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
   };
  public static matrixBigSection:any = {
   'FamilyName': {element: ():ElementFinder => $('.home-description-container>h3')},
   'FamilyDescription': {element: ():ElementFinder => $('.text-justify')},
   'BlockWithPhotosFamily': {element: ():ElementFinder => element.all(by.css('.images-container')).first()},
   'BlockWithPhotosHome': {element: ():ElementFinder => element.all(by.css('.images-container')).last()}
   };
  public static matrixBigSectionHower:any = {
   'CCIcon': {element: ():ElementFinder => $('img[src$="cc-icon-small.svg"]')},
   'IconPlus': {element: ():ElementFinder => $('img[src$="fullsize-icon.svg"]')},
   'IconDownload': {element: ():ElementFinder => $('img[src$="download-icon.svg"]')},
   'LinkToPhotographerPage': {element: ():ElementFinder => $('a[href*="/photographer/"]')},
   'LinkToCC': {element: ():ElementFinder => $('div[class*="photographer-container"] a[href*="licenses/by/4.0/"]')},
   'LinkToViewFullSize': {element: ():ElementFinder => $('.zoom-download-container>span')},
   'LinkToDownloadImage': {element: ():ElementFinder => $('.download')}
   };
  public static homePageBoolean:any = {
   'LogoImgInHeader': {element: ():ElementFinder => element.all(by.css('.logo.pull-left>img')).first()},
   'LinkToFilter': {element: ():ElementFinder => element.all(by.css('.heading.pull-left')).first()},
   'FamilyImage': {element: ():ElementFinder => element.all(by.css('.image-container>img')).first()},
   'MapImage': {element: ():ElementFinder => $('.map.map_gray')},
   'FamilyName': {element: ():ElementFinder => element.all(by.css('.title')).first()},
   'FamilyIncome': {element: ():ElementFinder => element.all(by.css('.title')).get(1)},
   'CountryName': {element: ():ElementFinder => element.all(by.css('.title')).get(2)}
   };
  public static homePageText:any = {
   'TextFilterInHeaderHome': {element: ():ElementFinder => $('p[class*="heading pull-left"]'), actualResult: 'Home in the world'},
   'TextHomeOf': {element: ():ElementFinder => element.all(by.css('.sub-title')).first(), actualResult: 'Home of'},
   'TextHouseholdWeeklyIncome': {element: ():ElementFinder => element.all(by.css('.sub-title')).get(1), actualResult: 'Household monthly income'},
   'TextCountry': {element: ():ElementFinder => element.all(by.css('.sub-title')).get(2), actualResult: 'Country'},
   'ShowArticle': {element: ():ElementFinder => $('div[class*="show-info"] span'), actualResult: 'Read more'}
   };
  public static welcomeWizardText:any = {
   'findOutHowPeopleLive': {element: ():ElementFinder => $('div[class*="font-large"]'), actualResult: 'Find out how people really live' },
   'welcomeHeaderDescription': {element: ():ElementFinder => $('.header-onboard-editable-text'), actualResult: 'The news make people in other cultures seem stranger than they are. We visited 240 families in 46 countries and collected 30 000 photos. We sorted the homes by income, from left to right.' },
   'quickTour': {element: ():ElementFinder => $('.onboard-button-qt>span'), actualResult: 'Quick tour!' },
   'maybeLater': {element: ():ElementFinder => $('.onboard-button-ml'), actualResult: 'Maybe later!' },
   'closeButton': {element: ():ElementFinder => $('.pull-right.close-button.font-large'), actualResult: '' }
   };
}
