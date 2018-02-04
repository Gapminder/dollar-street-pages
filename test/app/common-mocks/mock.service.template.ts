import { provide } from '@angular/core';

export class MockService {
  public countOfSubscribes:number = 0;
  private response:any;
  private name:string;

  public subscribe(callback:any):this {
    this.countOfSubscribes++;
    callback(this.fakeResponse);
    return this;
  }

  public unsubscribe():void {
    this.countOfSubscribes--;
  }

  public emit():this {
    return;
  }

  public next():this {
    return;
  }

  public set serviceName(name:string) {
    this.name = name;
  }

  public getProviders():Array<any> {
    return [provide(this.name, {useValue: this})];
  }

  public set getMethod(name:any) {
    this[name] = (url?:any, qyery?:any) => this;
  }

  public get fakeResponse():any {
    return this.response;
  }

  public set fakeResponse(response:any) {
    this.response = response;
  }

  public toInitState():any {
    this.countOfSubscribes = 0;
  }
}
