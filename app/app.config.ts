import { MainComponent } from './main/main.component';
import { MatrixComponent } from './matrix/matrix.component';
import { PlaceComponent } from './place/place.component';

export module config {
  export let routes = [
    {
      path: '/main',
      name: 'Main',
      component: MainComponent,
      useAsDefault: true
    },
    {
      path: '/matrix',
      name: 'Matrix',
      component: MatrixComponent
    },
    {
      path: '/place',
      name: 'Place',
      component: PlaceComponent
    }
  ]
}
