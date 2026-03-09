import { NgModule } from '@angular/core';
import { ImagenPipePipe } from './imagen-pipe.pipe';
// import {DateAgoPipe} from './date-ago.pipe';
import { EscapeHtmlPipe } from './keep-html.pipe';
import { ShowByPipe } from './showby.pipe';
import { SortByPipe } from './sortby.pipe';
import { OrderByPipe } from './orderby.pipe';
import { UniquePipe } from './unique.pipe';


@NgModule({
  declarations: [
    ImagenPipePipe,
    // DateAgoPipe,
    EscapeHtmlPipe,
    ShowByPipe,
    SortByPipe,
    OrderByPipe,
    UniquePipe
  ],
  exports:[
    ImagenPipePipe,
    // DateAgoPipe,
    EscapeHtmlPipe,
    ShowByPipe,
    SortByPipe,
    OrderByPipe,
    UniquePipe

  ]
})
export class PipesModule { }
