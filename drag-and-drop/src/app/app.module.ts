import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DroppableDirective } from './droppable.directive';
import { DraggableDirective } from './draggable.directive';
import {DragService} from './drag.service';

@NgModule({
  declarations: [
    AppComponent,
    DroppableDirective,
    DraggableDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    DragService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
