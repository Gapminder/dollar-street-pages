import { Component, Inject, Input, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, Router } from '@angular/router-deprecated';
import { MainMenuComponent } from '../menu/menu.component';

let tpl = require('./header.template.html');
let style = require('./header.css');

@Component({
  selector: 'header',
  template: tpl,
  styles: [style],
  directives: [MainMenuComponent, RouterLink]
})

export class HeaderWithoutSearchComponent implements OnInit, OnDestroy {
  @Input()
  protected title:string;
  @Input()
  protected subTitle:string;

  private defaultThing:any;
  private headerService:any;
  private matrixComponent:boolean;
  private headerServiceSibscribe:any;
  private router:Router;

  public constructor(@Inject('HeaderService') headerService:any,
                     @Inject(Router) router:Router) {
    this.router = router;
    this.headerService = headerService;

    this.matrixComponent = this.router.hostComponent.name === 'MatrixComponent';
  }

  public ngOnInit():void {
    this.headerServiceSibscribe = this.headerService.getDefaultThing()
      .subscribe((res:any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.defaultThing = res.data;
      });
  }

  protected goToMatrixPage():void {
    if (this.matrixComponent) {
      location.reload();

      return;
    }

    this.router.navigate(['Matrix']);
  }

  public ngOnDestroy():void {
    this.headerServiceSibscribe.unsubscribe();
  }
}
