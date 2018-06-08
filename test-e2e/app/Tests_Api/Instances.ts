'use strict';

export class Instances {
  public static prodApi:string = 'http://prod-api.dollarstreet.org/consumer/api/v1/';
  public static secondPartLinkForMatrix:string = 'things?thing=';
  public static secondPartLinkForMap:string = 'map?thing=';
  public static secondPartLinkForPhotographers:string = 'photographers';
  public static secondPartLinkForPhotographerPlaces:string = 'photographer-places?id=';
  public static secondPartLinkForPhotographerProfile:string = 'photographer-profile?id=';
  public static secondPartLinkForCountryInfo:string = 'country-info?id=';
  public static secondPartLinkForCountryPlaces:string = 'country-places?id=';
  public static apiDev:string = 'http://apidev.dollarstreet.org/consumer/api/v1/';
  public static localHost:string = 'http://128.199.60.70:8015/v1/';
  public static lecturesApi: string = 'http://lectures.dollarstreet.org/consumer/api/v1/';
  public static lastPartLink: string = '&countries=World&regions=World&zoom=4&row=1&lowIncome=26&highIncome=15000&resolution=480x480';
}
