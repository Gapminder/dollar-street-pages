import { Injectable, EventEmitter } from '@angular/core';

import 'rxjs/add/operator/map';

@Injectable()
export class ActiveThingService {
    public activeThingEmitter: EventEmitter<any> = new EventEmitter<any>();

    public setActiveThing(thing: any): void {
        this.activeThingEmitter.emit(thing);
    }
}
