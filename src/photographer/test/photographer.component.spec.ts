import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';

import { PhotographerComponent } from '../photographer.component';

import { TitleHeaderService } from '../../common';

describe('PhotographerComponent', () => {
  let componentInstance: PhotographerComponent;
  let componentFixture: ComponentFixture<PhotographerComponent>;
  let nativeElement: HTMLElement;

  const userTitleHeaderService = {

  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ PhotographerComponent ],
      providers: [
                     { provide: TitleHeaderService, useValue: userTitleHeaderService }
                 ]
    });

    componentFixture = TestBed.overrideComponent(PhotographerComponent, {
        set: {
            template: ''
        }
    }).createComponent(PhotographerComponent);

    componentInstance = componentFixture.componentInstance;
  }));

  it('ngOnCreate() ngOnDestroy()', () => {
    componentInstance.ngOnInit();

    expect(componentInstance.titleHeaderService).toBeDefined();

    spyOn(componentInstance.queryParamsSubscribe, 'unsubscribe');

    componentInstance.ngOnDestroy();

    expect(componentInstance.queryParamsSubscribe.unsubscribe).toHaveBeenCalled();
  });
});
