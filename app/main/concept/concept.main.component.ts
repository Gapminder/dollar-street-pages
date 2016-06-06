import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';

let tpl = require('./concept.main.template.html');
let style = require('./concept.main.css');

@Component({
  selector: 'concept-main',
  template: tpl,
  styles: [style],
  directives: [RouterLink]
})

export class ConceptMainComponent implements OnInit, OnDestroy {
  public conceptMainService:any;
  public activeThing:any = {};
  public amazonS3Url:any = 'http://static.dollarstreet.org.s3.amazonaws.com/';
  public images:any[] = [];
  public things:any[] = [];
  public houseClassForRegion:any = {
    Asia: 'asia-house',
    Africa: 'africa-house',
    Europe: 'europe-house',
    America: 'america-house'
  };
  private conceptMainServiceSubscribe:any;

  public constructor(@Inject('ConceptMainService') conceptMainService:any) {
    this.conceptMainService = conceptMainService;
  }

  public ngOnInit():void {
    this.conceptMainServiceSubscribe = this.conceptMainService.getMainConceptThings({})
      .subscribe((res:any) => {
        if (res.err) {
          return res.err;
        }

        this.things = res.things;

        let lastThing = this.things[this.things.length - 1];

        this.activeThing = {_id: lastThing._id, plural: lastThing.plural, icon: lastThing.thingUrl};
        this.renderIncomePlot(this.activeThing);
      });
  }

  public ngOnDestroy():void {
    this.conceptMainServiceSubscribe.unsubscribe();
  }

  public selectThing(thing:any):void {
    this.activeThing = {_id: thing._id, plural: thing.plural, icon: thing.thingUrl};
    this.renderIncomePlot(thing);
  };

  public renderIncomePlot(thing:any):void {
    if (this.conceptMainServiceSubscribe) {
      this.conceptMainServiceSubscribe.unsubscribe();
    }

    this.conceptMainServiceSubscribe = this.conceptMainService.getMainConceptImages({thingId: thing._id})
      .subscribe((res:any) => {
        if (res.err) {
          return res.err;
        }

        this.images = res.images;
      });
  }
}
