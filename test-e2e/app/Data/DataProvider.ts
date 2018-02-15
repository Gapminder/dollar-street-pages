'use strict';
import { element, by, $ } from 'protractor';
import { ElementFinder, ElementArrayFinder } from 'protractor/built/index';
import { MatrixPage } from '../Pages/MatrixPage';

export class DataProvider {

  /*public static blogPage:any = {
    'h1': {element: ():ElementFinder => $('h2[class*="heading pull-left"]'), actualResult: 'Blog'}
  };

  public static blogPagePosts:any = {
    'titles': {element: ():ElementArrayFinder => element.all(by.css('.post-title'))},
    'readMore': {element: ():ElementArrayFinder => element.all(by.css('.post-p>a'))},
    'images': {element: ():ElementArrayFinder => element.all(by.css('.dynamic-wrap-img>img'))}
  };

  public static blogPosts:any = {
    'PostTitle': {element: ():ElementFinder => $('.dynamic-details.col-md-12>h1')}
  };*/

  public static countryPageText:any = {
    'VisitedFamilies': {element: ():ElementFinder => $('p[class*="home"]')},
    'TotalPhotos': {element: ():ElementFinder => $('p[class="photo"]')},
    'VisitFamily': {element: ():ElementFinder => element.all(by.css('a[class*="custom-button"]')).first()}
  };

  public static footerTextInfo:any = {
    'getDollarStreet': {element: ():ElementFinder => $('.logo-container>p'), actualResult: 'DOLLAR STREET'},
    'Home': {element: ():ElementFinder => element.all(by.css('.links>a')).get(0), actualResult: 'Home'},
    'About': {element: ():ElementFinder => element.all(by.css('.links>a')).get(1), actualResult: 'About'},
    'Team': {element: ():ElementFinder => element.all(by.css('.links>a')).get(2), actualResult: 'Team'},
    'Donate': {element: ():ElementFinder => element.all(by.css('.links>a')).get(3), actualResult: 'Donate'},
    'Photographers': {element: ():ElementFinder => element.all(by.css('.links>a')).get(4), actualResult: 'Photographers'}
  };

  public static footerBooleanInfo:any = {
    'FacebookIcon': {logoCSS: '.follow-button>a[href*="facebook"]'},
    'TwitterIcon': {logoCSS: '.follow-button>a[href*="twitter"]'},
    'InstagramIcon': {logoCSS: '.follow-button>a[href*="instagram"]'},
    'LinkedinIcon': {logoCSS: '.follow-button>a[href*="linkedin"]'},
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
    'EnterDavideVadalaInSearchField': {photographerQuery: 'Davide'}
  };

  public static photographerPageBoolean:any = {
    'NamePhotographer': {photographerDataCSS: '.heading'},
    'PhotographerFamilies': {photographerDataCSS: '.family>h3'},
    'TotalPhotosByPhotographer': {photographerDataCSS: '.photo'}
  };

  public static mapPageCountry:any = {
    'CountryBangladesh': {
      element: ():ElementFinder => element.all(by.css('span[class*="country-name"]')).get(0),
      actualResult: 'Bangladesh'
    },
    'CountryColombia': {
      element: ():ElementFinder => element.all(by.css('span[class*="country-name"]')).get(8),
      actualResult: 'Colombia'
    },
    'CountryIndonesia': {
      element: ():ElementFinder => element.all(by.css('span[class*="country-name"]')).get(13),
      actualResult: 'Indonesia'
    },
    'CountryLithuania': {
      element: ():ElementFinder => element.all(by.css('span[class*="country-name"]')).get(17),
      actualResult: 'Liberia'
    },
    'CountryRwanda': {
      element: ():ElementFinder => element.all(by.css('span[class*="country-name"]')).get(31),
      actualResult: 'Rwanda'
    }
  };

  public static photographersPageSearch:any = {
    'Input_Bangladesh_InSearchField': {countryQuery: 'bang'},
    'Input_Bulgaria_InSearchField': {countryQuery: 'bulg'},
    'Input_Colombia_InSearchField': {countryQuery: 'colomb'},
    'Input_India_InSearchField': {countryQuery: 'indi'},
    'Input_France_InSearchField': {countryQuery: 'fra'},
    'Input_Kazakhstan_InSearchField': {countryQuery: 'kaza'},
    'Input_Liberia_InSearchField': {countryQuery: 'libe'},
    'Input_Mexico_InSearchField': {countryQuery: 'mexi'},
    'Input_Turkey_InSearchField': {countryQuery: 'tur'}
  };

  public static ambassadorsPageText:any = {
    'H2InHeader': {element: ():ElementFinder => $('.heading.pull-left'), actualResult: 'Dollar Street Team'}
  };

  public static ambassadorsPageBoolean:any = {
    'LogoImgInHeader': {element: ():ElementFinder => $('.icon-container.pull-left>img')},
    'MenuIconInHeader': {element: ():ElementFinder => $('.menu-icon')}
  };

  public static matrixPageText:any = {
    'H2BYInHeader': {
      element: () => element.all(by.css('div[class*="some-filter-container"]>span')).first().getText(),
      actualResult: 'in'
    },
    'H2INInHeader': {
      element: () => element.all(by.css('div[class*="some-filter-container"]>span')).last().getText(),
      actualResult: 'by income'
    },
    'PoorestHeaderOnStreetWidget': {
      element: () => $('text[class="poorest"]').getText(),
      actualResult: 'POOREST'
    },
    'RichestHeaderOnStreetWidget': {element: () => $('text[class="richest"]').getText(), actualResult: 'RICHEST'}
  };

  public static matrixPageBoolean:any = {
    'HomeIconInHeader': {element: ():ElementFinder => $('.things-filter-button-content>img')},
    'LogoImageInHeader': {element: ():ElementFinder => $('.icon-container.pull-left>img')},
    'MenuIconInHeader': {element: ():ElementFinder => $('.unactive')},
    'StreetWidgetImage': {element: ():ElementFinder => $('polygon[class="road"]')},
    'ThingsFilter': {element: ():ElementFinder => $('div[class*="things-filter-button-content"]')},
    'CountryFilter': {element: ():ElementFinder => $('div[class*="countries-filter-button"]')},
    'ZoomButtonPlus': {element: ():ElementFinder => element.all(by.css('img[class="sign"]')).get(0), actualResult: '+'},
    'ZoomButtonMinus': {element: ():ElementFinder => element.all(by.css('img[class="sign"]')).get(1), actualResult: '-'}
  };

  public static matrixPageImages:any = {
    'HousesOnStreetWidget': {element: ():ElementArrayFinder => element.all(by.css('polygon[class="point"]'))},
    'ImageContent': {element: ():ElementArrayFinder => element.all(by.css('.image-content'))},
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
    'HomesHeaderInSearch': {
      element: ():ElementFinder => element.all(by.css('div[class*="things-filter-button-content"] span')).first(),
      actualResult: 'Families'
    },
    'AllIncomesHeaderInSearch': {
      element: ():ElementFinder => element.all(by.css('.income-title')).last(),
      actualResult: 'by income'
    },
    'TheWorldHeaderInSearch': {
      element: ():ElementFinder => element.all(by.css('div[class*="countries-filter-button"] span')).first(),
      actualResult: 'the World'
    }
  };

  public static matrixPageQueries:any = {
    'ThingPets': {query: 'Pets'},
    'ThingFamilySnapshots': {query: 'Family snapshots'},
    'ThingWalls': {query: 'Wall decorations'},
    'ThingFrontDoor': {query: 'Front doors'},
    'ThingSittingArea': {query: 'Sitting areas'},
    'ThingPlaces for dinner': {query: 'Places for dinner'},
    'ThingArmchair': {query: 'Armchairs'},
    'ThingBooks': {query: 'Books'}
  };

  public static countryPageId:any = {
    'Bangladesh': {countryId: '55ef338d0d2b3c82037884d0', numberOfCell: '73'},
    'Cambodia': {countryId: '55ef338d0d2b3c82037884d3', numberOfCell: '89'},
    'France': {countryId: '55ef338d0d2b3c8203788441', numberOfCell: '123'},
    'Indonesia': {countryId: '55ef338d0d2b3c82037884d9', numberOfCell: '144'},
    'Latvia': {countryId: '55ef338d0d2b3c8203788448', numberOfCell: '163'},
    'Mexico': {countryId: '55ef338d0d2b3c8203788479', numberOfCell: '181'},
    'Nigeria': {countryId: '55ef338d0d2b3c82037884b7', numberOfCell: '196'},
    'Philippines': {countryId: '55ef338d0d2b3c82037884ed', numberOfCell: '206'},
    'Rwanda': {countryId: '55ef338d0d2b3c82037884b9', numberOfCell: '214'},
    'Tunisia': {countryId: '55ef338d0d2b3c82037884c5', numberOfCell: '252'},
    'Bolivia': {countryId: '55ef338d0d2b3c8203788469', numberOfCell: '80'},
    'Burkina Faso': {countryId: '55ef338d0d2b3c8203788493', numberOfCell: '87'},
    'Burundi': {countryId: '55ef338d0d2b3c8203788494', numberOfCell: '88'},
    'China': {countryId: '55ef338d0d2b3c82037884d4', numberOfCell: '97'},
    'Colombia': {countryId: '55ef338d0d2b3c820378846c', numberOfCell: '98'},
    'Cote d\'Ivoire': {countryId: '55ef338d0d2b3c820378849a', numberOfCell: '103'},
    'Haiti': {countryId: '55ef338d0d2b3c8203788477', numberOfCell: '138'},
    'India': {countryId: '55ef338d0d2b3c82037884d8', numberOfCell: '143'},
    'Jordan': {countryId: '55ef338d0d2b3c82037884dd', numberOfCell: '154'},
    'Kenya': {countryId: '55ef338d0d2b3c82037884a9', numberOfCell: '156'},
    'Liberia': {countryId: '55ef338d0d2b3c82037884ab', numberOfCell: '166'},
    'Malawi': {countryId: '55ef338d0d2b3c82037884b3', numberOfCell: '173'},
    'Myanmar': {countryId: '55ef338d0d2b3c82037884e7', numberOfCell: '190'},
    'Nepal': {countryId: '55ef338d0d2b3c82037884e8', numberOfCell: '192'},
    'Pakistan': {countryId: '55ef338d0d2b3c82037884eb', numberOfCell: '199'},
    'Papua New Guinea': {countryId: '55ef338d0d2b3c82037884e2', numberOfCell: '203'},
    'Romania': {countryId: '55ef338d0d2b3c8203788455', numberOfCell: '212'},
    'Russia': {countryId: '55ef338d0d2b3c82037884ef', numberOfCell: '213'},
    'Somalia': {countryId: '55ef338d0d2b3c82037884bf', numberOfCell: '231'},
    'South Africa': {countryId: '55ef338d0d2b3c82037884c9', numberOfCell: '232'},
    'South Korea': {countryId: '55ef338d0d2b3c82037884f3', numberOfCell: '159'},
    'Sweden': {countryId: '55ef338d0d2b3c820378845b', numberOfCell: '241'},
    'Tanzania': {countryId: '55ef338d0d2b3c82037884c6', numberOfCell: '246'},
    'Thailand': {countryId: '55ef338d0d2b3c82037884f7', numberOfCell: '247'},
    'Turkey': {countryId: '55ef338d0d2b3c82037884f8', numberOfCell: '253'},
    'Ukraine': {countryId: '55ef338d0d2b3c820378845d', numberOfCell: '258'},
    'United Kingdom': {countryId: '55ef338d0d2b3c820378845e', numberOfCell: '260'},
    'United States': {countryId: '55ef338d0d2b3c8203788467', numberOfCell: '261'},
    'Vietnam': {countryId: '55ef338d0d2b3c82037884fc', numberOfCell: '266'},
    'Zimbabwe': {countryId: '55ef338d0d2b3c82037884cb', numberOfCell: '271'}
  };

  public static matrixBigSection:any = {
    'FamilyName': {element: ():ElementFinder => MatrixPage.familyName},
    'FamilyDescription': {element: ():ElementFinder => $('.home-description-container>p')},
    'BlockWithPhotosFamily': {element: ():ElementFinder => element.all(by.css('.image-content>img')).first()},
    'BlockWithPhotosHome': {element: ():ElementFinder => element.all(by.css('.image-content>img')).last()}
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
    'LogoImgInHeader': {element: ():ElementFinder => element.all(by.css('.icon-container.pull-left>img')).first()},
    'LinkToFilter': {element: ():ElementFinder => element.all(by.css('.heading.pull-left')).first()},
    'FamilyImage': {element: ():ElementFinder => element.all(by.css('.image-container>img')).first()},
    'MapImage': {element: ():ElementFinder => $('.map.map_gray')},
    'FamilyName': {element: ():ElementFinder => element.all(by.css('.title')).first()},
    'FamilyIncome': {element: ():ElementFinder => element.all(by.css('.title')).get(1)},
    'CountryName': {element: ():ElementFinder => element.all(by.css('.title')).get(2)}
  };

  public static homePageText:any = {
    'TextFilterInHeaderHome': {
      element: ():ElementFinder => $('p[class*="heading pull-left"]'),
      actualResult: 'Families in the World'
    },
    'TextHomeOf': {element: ():ElementFinder => element.all(by.css('.sub-title')).first(), actualResult: 'Home of'},
    'TextHouseholdWeeklyIncome': {
      element: ():ElementFinder => element.all(by.css('.sub-title')).get(1),
      actualResult: 'Monthly income'
    },
    'TextCountry': {element: ():ElementFinder => element.all(by.css('.sub-title')).get(2), actualResult: 'Country'},
    'ShowArticle': {element: ():ElementFinder => $('div[class*="show-info"] span'), actualResult: 'Read more'}
  };

  public static welcomeWizardText:any = {
    'findOutHowPeopleLive': {
      element: ():ElementFinder => $('.quick-guide-description-container>h1'),
      actualResult: 'DOLLAR STREET'
    },
    'welcomeHeaderDescription': {
      element: ():ElementFinder => $('div[class^="guide-description"]'),
      actualResult: 'In the news people in other cultures seem stranger than they are.' + '\n' +
      'We visited 264 families in 50 countries and collected 30,000 photos.' + '\n' +
      'We sorted the homes by income, from left to right.'
    },
    'quickTour': {element: ():ElementFinder => $('.bg-orange'), actualResult: 'Quick tour'},
    'maybeLater': {element: ():ElementFinder => element.all(by.css('.button-container>button')).get(1), actualResult: 'Maybe later'},
    'seeHowPeopleLive': {element: ():ElementFinder => $('.quick-guide-description-container>h2'), actualResult: 'Imagine the world as a street. Everyone lives on Dollar Street. The richest to the left and the poorest to the right. Every else live somewhere in between. Where would you live? Visit Dollar Street and see homes from hundreds of homes from all over the World.'},
    'closeButton': {element: ():ElementFinder => $('.quick-guide-container>img'), actualResult: ''},
    'logo': {element: ():ElementFinder => $('div[class*="logo-container"] img[alt="Logo"]'), actualResult: ''}
  };

  public static photographerLinks:any = {
    'JohanEriksson': {
      photographerLink: '/dollar-street/photographer/56ec0916af72e9437cbccf91'
    },
    'JonathanTaylor': {
      photographerLink: '/dollar-street/photographer/56ec0917af72e9437cbccf94'
    },
    'LucForsyth': {
      photographerLink: '/dollar-street/photographer/56ec0918af72e9437cbccf97'
    },
    'RolandZsigmond': {
      photographerLink: '/dollar-street/photographer/56ec0917af72e9437cbccf95'
    },
    'Victrixia Montes': {
      photographerLink: '/dollar-street/photographer/56ec0916af72e9437cbccf90'
    }
  };

  public static stickyFooterIcons:any = {
    'Twitter': {element: ():ElementFinder => $('div[class*="float-footer"] div[class*="twitter"]')},
    'Facebook': {element: ():ElementFinder => $('div[class*="float-footer"] div[class*="facebook"]')},
    'Linkedin': {element: ():ElementFinder => $('div[class*="float-footer"] div[class*="linkedin"]')},
    'Google': {element: ():ElementFinder => $('div[class*="float-footer"] div[class*="google"]')},
    'TwitterFollow': {element: ():ElementFinder => $('iframe[id*="twitter-widget-0"]')},
    'FacebookFollow': {element: ():ElementFinder => element.all(by.css('div[class*="fb-like"]')).first()},
    'AngleUp': {element: ():ElementFinder => element.all(by.css('.back-to-top')).first()}
  };

  public static homePageLinks: any = {
    'Burundi27': {element: ():string => '54afe95c80d862d9767cf32e', actualFamilyName: ():string => 'Butoyi', actualCountry: ():string => 'Burundi', actualIncome: ():string => '27'},
    'Romania163': {element: ():string => '56446ce95ace839829fe897f', actualFamilyName: ():string => 'Mezei', actualCountry: ():string => 'Romania', actualIncome: ():string => '163'},
    'India466': {element: ():string => '54b520ed05df73e55431912b', actualFamilyName: ():string => 'Gada', actualCountry: ():string => 'India', actualIncome: ():string => '466'}
    // 'Latvia11381': {element: ():string => '55646e1512d20a701a1e19eb', actualFamilyName: ():string => 'Lokometi', actualCountry: ():string => 'Latvia', actualIncome: ():string => '11 381'},
    // 'India29': {element: ():string => '557036781e788ebf3eb00f99', actualFamilyName: ():string => 'Chowdhury', actualCountry: ():string => 'India', actualIncome: ():string => '29'},
    // 'Colombia163': {element: ():string => '54b3de069f0c8d666e1ac0d1', actualFamilyName: ():string => 'Collo Ocoro', actualCountry: ():string => 'Colombia', actualIncome: ():string => '163'},
    // 'Rwanda460': {element: ():string => '54b816d8c53d4fa64fb896a5', actualFamilyName: ():string => 'Niyonsaba', actualCountry: ():string => 'Rwanda', actualIncome: ():string => '460'},
    // 'China10098': {element: ():string => '55cddb562ae4cb466761033b', actualFamilyName: ():string => 'Bi', actualCountry: ():string => 'China', actualIncome: ():string => '10 098'},
    // 'Malawi30': {element: ():string => '54b7b92fcb00419b4f4bfb48', actualFamilyName: ():string => 'Njoka', actualCountry: ():string => 'Malawi', actualIncome: ():string => '30'},
    // 'Ukraine476': {element: ():string => '5571a085125eea582cbd257b', actualFamilyName: ():string => 'Krivko', actualCountry: ():string => 'Ukraine', actualIncome: ():string => '476'},
    // 'Ukraine10090': {element: ():string => '5571913377fa3d7747d0016d', actualFamilyName: ():string => 'Sdambulyak', actualCountry: ():string => 'Ukraine', actualIncome: ():string => '10 090'},
    // 'India31': {element: ():string => '55701b7a264c39803ebfa785', actualFamilyName: ():string => 'Chandmoni Bibi', actualCountry: ():string => 'India', actualIncome: ():string => '31'},
    // 'Philippines170': {element: ():string => '54b80b32c53d4fa64fb8959d', actualFamilyName: ():string => 'Castillo', actualCountry: ():string => 'Philippines', actualIncome: ():string => '170'},
    // 'China450': {element: ():string => '55cddf4bd5e7ba4a67c0d24d', actualFamilyName: ():string => 'An', actualCountry: ():string => 'China', actualIncome: ():string => '450'},
    // 'Jordan7433': {element: ():string => '5571821aa5d751682cc9a72d', actualFamilyName: ():string => 'Murad', actualCountry: ():string => 'Jordan', actualIncome: ():string => '7 433'},
    // 'Zimbabwe34': {element: ():string => '54b92ab002f7310b2e0bac93', actualFamilyName: ():string => 'Majuru', actualCountry: ():string => 'Zimbabwe', actualIncome: ():string => '34'},
    // 'Tunisia176': {element: ():string => '54b8d5f66a3b3a496537fe88', actualFamilyName: ():string => 'Haji', actualCountry: ():string => 'Tunisia', actualIncome: ():string => '176'},
    // 'Latvia480': {element: ():string => '5564770b398632ef199dcd39', actualFamilyName: ():string => 'Baloži', actualCountry: ():string => 'Latvia', actualIncome: ():string => '480'},
    // 'Mexico6342': {element: ():string => '54b7c01f25003a824f648898', actualFamilyName: ():string => 'Ortiz', actualCountry: ():string => 'Mexico', actualIncome: ():string => '6 342'},
    // 'Haiti39': {element: ():string => '54b4eb529f0c8d666e1ac327', actualFamilyName: ():string => 'Jacques', actualCountry: ():string => 'Haiti', actualIncome: ():string => '39'},
    // 'Colombia145': {element: ():string => '54b3daaf57de10366ed135ab', actualFamilyName: ():string => 'Iquira Collo', actualCountry: ():string => 'Colombia', actualIncome: ():string => '145'},
    // 'Cambogia437': {element: ():string => '54b398fca5a3d7566eb0030a', actualFamilyName: ():string => 'Pen', actualCountry: ():string => 'Cambodia', actualIncome: ():string => '437'},
    // 'Sweden4883': {element: ():string => '54c8e344c34080c44f710855', actualFamilyName: ():string => 'Västibacken', actualCountry: ():string => 'Sweden', actualIncome: ():string => '4 883'},
    // 'Burundi40': {element: ():string => '54afe2b1993307fb769cc634', actualFamilyName: ():string => 'Nidikumwami', actualCountry: ():string => 'Burundi', actualIncome: ():string => '40'},
    // 'Thailand179': {element: ():string => '54b8d3ecdf5b1757652605f8', actualFamilyName: ():string => 'Kanchu', actualCountry: ():string => 'Thailand', actualIncome: ():string => '179'},
    // 'Russia578': {element: ():string => '55bb8eabf4e5fe8c0acd9b5e', actualFamilyName: ():string => 'Kiriny', actualCountry: ():string => 'Russia', actualIncome: ():string => '578'},
    // 'Myanmar45': {element: ():string => '56098a94555bf97705720e39', actualFamilyName: ():string => 'Raju', actualCountry: ():string => 'Myanmar', actualIncome: ():string => '45'},
    // 'Bolivia180': {element: ():string => '54be2ac36c9e7cf91e2ed92d', actualFamilyName: ():string => 'Eucinaz', actualCountry: ():string => 'Bolivia', actualIncome: ():string => '180'},
    // 'India397': {element: ():string => '54b51c593755cbfb542c24a5', actualFamilyName: ():string => 'Abdul Kadhar', actualCountry: ():string => 'India', actualIncome: ():string => '397'},
    // 'SouthKorea4531': {element: ():string => '5665dfb2128222cf7e6c1ec1', actualFamilyName: ():string => 'Han', actualCountry: ():string => 'South Korea', actualIncome: ():string => '4 531'},
    // 'Haiti51': {element: ():string => '54b4e6e157de10366ed13811', actualFamilyName: ():string => 'Pierre', actualCountry: ():string => 'Haiti', actualIncome: ():string => '51'},
    // 'Bangladesh125': {element: ():string => '54be2720c4a0e60017efb08f', actualFamilyName: ():string => 'Bishash', actualCountry: ():string => 'Bangladesh', actualIncome: ():string => '125'},
    // 'France3764': {element: ():string => '54afd1eabe3215e776813dd3', actualFamilyName: ():string => 'Bourguinat', actualCountry: ():string => 'France', actualIncome: ():string => '3 764'},
    // 'BurkinaFaso53': {element: ():string => '54afae37993307fb769cc52f', actualFamilyName: ():string => 'Bande', actualCountry: ():string => 'Burkina Faso', actualIncome: ():string => '53'},
    // 'Nigeria124': {element: ():string => '54b7dee3c53d4fa64fb89337', actualFamilyName: ():string => 'Shemede', actualCountry: ():string => 'Nigeria', actualIncome: ():string => '124'},
    // 'India311': {element: ():string => '5575f600f59550d43f443110', actualFamilyName: ():string => 'Prasad Singh', actualCountry: ():string => 'India', actualIncome: ():string => '311'},
    // 'China3704': {element: ():string => '54b3cc3257de10366ed13507', actualFamilyName: ():string => 'Wu', actualCountry: ():string => 'China', actualIncome: ():string => '3 704'},
    // 'Bangladesh58': {element: ():string => '56056a7fcd8f1e9a207bb4f7', actualFamilyName: ():string => 'Paramanik', actualCountry: ():string => 'Bangladesh', actualIncome: ():string => '58'},
    // 'Myanmar195': {element: ():string => '560c1746144af7bc27697772', actualFamilyName: ():string => 'Aye', actualCountry: ():string => 'Myanmar', actualIncome: ():string => '195'},
    // 'Ukraine694': {element: ():string => '5571882d2d54dcff2baec573', actualFamilyName: ():string => 'Dudakova', actualCountry: ():string => 'Ukraine', actualIncome: ():string => '694'},
    // 'Sweden3439': {element: ():string => '54c8e693611e5f944fb3f17b', actualFamilyName: ():string => 'Lyckner', actualCountry: ():string => 'Sweden', actualIncome: ():string => '3 439'},
    // 'Nigeria59': {element: ():string => '54b7e39d25003a824f648a60', actualFamilyName: ():string => 'Ehegwo', actualCountry: ():string => 'Nigeria', actualIncome: ():string => '59'},
    // 'Colombia123': {element: ():string => '54773e2f86deda0b00d438c3', actualFamilyName: ():string => 'Alvarado Bello', actualCountry: ():string => 'Colombia', actualIncome: ():string => '123'},
    // 'Cambodia295': {element: ():string => '54afec49993307fb769cc6fb', actualFamilyName: ():string => 'Thor', actualCountry: ():string => 'Cambodia', actualIncome: ():string => '295'},
    // 'Kenya3268': {element: ():string => '5547642987c83eb26cb2a12a', actualFamilyName: ():string => 'Kimathi', actualCountry: ():string => 'Kenya', actualIncome: ():string => '3 268'},
    // 'Bangladesh65': {element: ():string => '5605646aa2a911bf204e9e79', actualFamilyName: ():string => 'Saiful', actualCountry: ():string => 'Bangladesh', actualIncome: ():string => '65'},
    // 'Nepal201': {element: ():string => '54b7d2b525003a824f64894c', actualFamilyName: ():string => 'Lama', actualCountry: ():string => 'Nepal', actualIncome: ():string => '201'},
    // 'Romania722': {element: ():string => '5571ad82125eea582cbd27b8', actualFamilyName: ():string => 'Crihan', actualCountry: ():string => 'Romania', actualIncome: ():string => '722'},
    // 'Vietnam2944': {element: ():string => '547723a486deda0b00d4379c', actualFamilyName: ():string => 'Tran', actualCountry: ():string => 'Vietnam', actualIncome: ():string => '2 944'},
    // 'CoteDIvoire68': {element: ():string => '54b64c345edc101155fa20ef', actualFamilyName: ():string => 'Bakary', actualCountry: ():string => 'Cote d\'Ivoire', actualIncome: ():string => '68'},
    // 'Tunisia116': {element: ():string => '54b8dfe93b3a1d796520b149', actualFamilyName: ():string => 'Azouze', actualCountry: ():string => 'Tunisia', actualIncome: ():string => '116'},
    // 'Indonesia284': {element: ():string => '54b5388438ef07015525f229', actualFamilyName: ():string => 'Susila', actualCountry: ():string => 'Indonesia', actualIncome: ():string => '284'},
    // 'France2895': {element: ():string => '552eb3a607e829712d3a23b8', actualFamilyName: ():string => 'Moulefera', actualCountry: ():string => 'France', actualIncome: ():string => '2 895'},
    // 'Bangladesh72': {element: ():string => '56056871cd8f1e9a207bb4bf', actualFamilyName: ():string => 'Paramanik', actualCountry: ():string => 'Bangladesh', actualIncome: ():string => '72'},
    // 'Indonesia210': {element: ():string => '54b53af93755cbfb542c254e', actualFamilyName: ():string => 'Wijianto', actualCountry: ():string => 'Indonesia', actualIncome: ():string => '210'},
    // 'Bolivia265': {element: ():string => '548efe940ad9d234652ac77b', actualFamilyName: ():string => 'Poma', actualCountry: ():string => 'Bolivia', actualIncome: ():string => '265'},
    // 'China2235': {element: ():string => '577ccf7ffc340b652f974bea', actualFamilyName: ():string => 'Zhao', actualCountry: ():string => 'China', actualIncome: ():string => '2 235'},
    // 'Zimbabwe73': {element: ():string => '54b927c4472e93d62d92654e', actualFamilyName: ():string => 'Mubaiwa', actualCountry: ():string => 'Zimbabwe', actualIncome: ():string => '73'},
    // 'BurkinaFaso95': {element: ():string => '54af9f8d993307fb769cc481', actualFamilyName: ():string => 'Alimata', actualCountry: ():string => 'Burkina Faso', actualIncome: ():string => '95'},
    // 'SouthKorea835': {element: ():string => '5665e28e9cddcdeb7eef8b67', actualFamilyName: ():string => 'Ko', actualCountry: ():string => 'South Korea', actualIncome: ():string => '835'},
    // 'Sweden2223': {element: ():string => '54e1e93d29e8457d2867302f', actualFamilyName: ():string => 'Ringnér', actualCountry: ():string => 'Sweden', actualIncome: ():string => '2 223'},
    // 'India80': {element: ():string => '556f2fdb1e788ebf3eb00c6d', actualFamilyName: ():string => 'Das', actualCountry: ():string => 'India', actualIncome: ():string => '80'},
    // 'Philippines': {element: ():string => '54b80958c53d4fa64fb8956d', actualFamilyName: ():string => 'Hueqtas', actualCountry: ():string => 'Philippines', actualIncome: ():string => '238'},
    // 'Bolivia254': {element: ():string => '54b39197b1c479446e1def85', actualFamilyName: ():string => 'Kjapa', actualCountry: ():string => 'Bolivia', actualIncome: ():string => '254'},
    // 'CoteDIvoire81': {element: ():string => '54b64f5105df73e55431939e', actualFamilyName: ():string => 'Ahoua', actualCountry: ():string => 'Cote d\'Ivoire', actualIncome: ():string => '81'},
    // 'Liberia87': {element: ():string => '54b686db05df73e554319553', actualFamilyName: ():string => 'Doe', actualCountry: ():string => 'Liberia', actualIncome: ():string => '87'},
    // 'China840': {element: ():string => '55d1a92631ba2203247b1b5e', actualFamilyName: ():string => 'Alu', actualCountry: ():string => 'China', actualIncome: ():string => '840'},
    // 'France2194': {element: ():string => '552eb4afb9092b3f2dbab2ee', actualFamilyName: ():string => 'Carasco', actualCountry: ():string => 'France', actualIncome: ():string => '2 194'},
    // 'Myanmar84': {element: ():string => '560986d5555bf97705720e05', actualFamilyName: ():string => 'Shew', actualCountry: ():string => 'Myanmar', actualIncome: ():string => '84'}
  };
  public static allPagesScreenShots:any = {
    'Matrix Page': {url: 'matrix'},
    'Map Page': {url: 'map'},
    'Team Page': {url: 'team'}
  };
  public static mapPageHover:any = {
    'Family Image': {element: ():ElementFinder => $('.hover_portrait_box>img')},
    'Family Name': {element: ():ElementFinder => element.all(by.css('.name')).first()},
    'Country Name': {element: ():ElementFinder => element.all(by.css('.country')).first()},
    'Family Income': {element: ():ElementFinder => element.all(by.css('.income')).first()},
    'See all Families': {element: ():ElementFinder => $('.see-all-span')}
  };
}
