/**
 * Created by igor on 3/30/16.
 */

import {provide} from 'angular2/core';
export class MockService {
  private response;
  private isUnsubscribe = false;

  subscribe(callback):this {
    callback(this.fakeResponse);
    return this;
  }

  unsubscribe():void {
    if(this.isUnsubscribe){
      return;
    }
    this.isUnsubscribe = !this.isUnsubscribe;
  }

  getProviders():Array<any> {
    return [provide('PhotographersService', {useValue: this})];
  }

  getPhotographers():this {
    return this
  }

  get fakeResponse() {
    return this.response;
  }

  set fakeResponse(response) {
    this.response = response;
  }
}
