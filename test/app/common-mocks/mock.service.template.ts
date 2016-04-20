/**
 * Created by igor on 3/30/16.
 */

import {provide} from 'angular2/core';
export class MockService {
  private response;
  private name:string;
  public countOfSubscribes:number = 0;

  subscribe(callback):this {
    this.countOfSubscribes++;
    callback(this.fakeResponse);
    return this;
  }

  unsubscribe():void {
    this.countOfSubscribes--;
  }

  emit():this {
    return;
  }
  next():this {
    return;
  }
  set serviceName(name:string) {
    this.name = name;
  }

  getProviders():Array<any> {
    return [provide(this.name, {useValue: this})];
  }

  set getMethod(name) {
    this[name] = (url?:any, qyery?:any) => this;
  }

  get fakeResponse() {
    return this.response;
  }

  set fakeResponse(response) {
    this.response = response;
  }

  public toInitState() {
    this.countOfSubscribes = 0;
  }
}
