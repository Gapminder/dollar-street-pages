import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { HeaderService } from '../header/header.service';
import { TitleHeaderService } from '../../common/title-header/title-header.service';

let tpl = require('./header.template.html');
let style = require('./header.css');

@Component({
  selector: 'header-without-filters',
  template: tpl,
  styles: [style]
})

export class HeaderWithoutFiltersComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('heading')
  private heading: ElementRef;

  private title: string;
  private defaultThing: any;
  private headerService: HeaderService;
  private titleHeaderService: TitleHeaderService;
  private titleHeaderSubscribe: Subscription;
  private headerServiceSubscribe: Subscription;
  private renderer: Renderer;

  public constructor(renderer: Renderer,
                     headerService: HeaderService,
                     titleHeaderService: TitleHeaderService) {
    this.renderer = renderer;
    this.headerService = headerService;
    this.titleHeaderService = titleHeaderService;
  }

  public ngOnInit(): void {
    this.headerServiceSubscribe = this.headerService
      .getDefaultThing()
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.defaultThing = res.data;
      });

    this.title = this.titleHeaderService.getTitle();

    this.titleHeaderSubscribe = this.titleHeaderService
      .getTitleEvent()
      .subscribe((data: {title: string}) => {
        this.rendererTitle(data.title);
      });
  }

  public ngOnDestroy(): void {
    this.titleHeaderSubscribe.unsubscribe();
    this.headerServiceSubscribe.unsubscribe();
  }

  public ngAfterViewInit(): any {
    this.rendererTitle(this.title);
  }

  private rendererTitle(title: string): void {
    this.renderer.setElementProperty(this.heading.nativeElement, 'innerHTML', title);
  }
}
