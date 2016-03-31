/**
 * Created by igor on 3/30/16.
 */

import {provide} from 'angular2/core';
export class MockService {
  private response;
  private name:string;
  public isUnsubscribe = false;
    
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

  set serviceName(name:string){
      this.name=name
  }
  
  getProviders():Array<any> {
    return [provide(this.name, {useValue: this})];
  }

  set getMethod(name){
    this[name]=()=>this
  }

  get fakeResponse() {
    return this.response;
  }

  set fakeResponse(response) {
    this.response = response;
  }
}
