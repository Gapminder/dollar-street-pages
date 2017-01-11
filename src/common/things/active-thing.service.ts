import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class ActiveThingService {
    public activeThingEmitter: EventEmitter<any> = new EventEmitter<any>();

    public setActiveThing(thing: any): void {
        this.activeThingEmitter.emit(thing);
    }
}
